import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DownloadLink } from '../DownloadLink/DownloadLink'
import type { DownloadLinkProps } from '../DownloadLink/DownloadLink.types'

// Mock react-countdown
jest.mock('react-countdown', () => ({
  __esModule: true,
  default: ({ date, renderer, onComplete }: any) => {
    const React = require('react')
    const [timeLeft, setTimeLeft] = React.useState(120000) // 2 minutes in milliseconds
    
    React.useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1000
          if (newTime <= 0) {
            onComplete?.()
            return 0
          }
          return newTime
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }, [onComplete])
    
    return renderer({ 
      total: timeLeft, 
      minutes: Math.floor(timeLeft / 60000), 
      seconds: Math.floor((timeLeft % 60000) / 1000) 
    })
  },
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

const defaultProps: DownloadLinkProps = {
  downloadUrl: 'http://example.com/download',
  expiresAt: new Date(Date.now() + 120000), // 2 minutes in future
  onCountdownComplete: jest.fn(),
}

describe('DownloadLink', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render download link with correct URL', () => {
    render(<DownloadLink {...defaultProps} />)
    
    expect(screen.getByDisplayValue('http://example.com/download')).toBeInTheDocument()
    expect(screen.getByText('Download PDF')).toBeInTheDocument()
  })

  it('should copy link to clipboard when copy button is clicked', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined)
    navigator.clipboard.writeText = mockWriteText
    
    render(<DownloadLink {...defaultProps} />)
    
    const copyButton = screen.getAllByRole('button')[0] // First button is the copy button
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('http://example.com/download')
    })
    
    // Verify clipboard was called (the component may not show a success message)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://example.com/download')
  })

  it('should open download URL when download button is clicked', () => {
    const mockOpen = jest.fn()
    window.open = mockOpen
    
    render(<DownloadLink {...defaultProps} />)
    
    const downloadButton = screen.getByText('Download PDF')
    fireEvent.click(downloadButton)
    
    expect(mockOpen).toHaveBeenCalledWith('http://example.com/download', '_blank')
  })

  it('should show countdown timer', () => {
    render(<DownloadLink {...defaultProps} />)
    
    // The countdown should be visible (mocked to show 2 minutes)
    expect(screen.getByText(/2:00/)).toBeInTheDocument()
  })

  it('should call onCountdownComplete when countdown reaches zero', async () => {
    const mockOnCountdownComplete = jest.fn()
    render(<DownloadLink {...defaultProps} onCountdownComplete={mockOnCountdownComplete} />)
    
    // Fast-forward time to trigger countdown completion
    jest.advanceTimersByTime(120000)
    
    await waitFor(() => {
      expect(mockOnCountdownComplete).toHaveBeenCalled()
    })
  })

  it('should show expired state when countdown completes', async () => {
    const mockOnCountdownComplete = jest.fn()
    render(<DownloadLink {...defaultProps} onCountdownComplete={mockOnCountdownComplete} />)
    
    // Fast-forward time to trigger countdown completion
    jest.advanceTimersByTime(120000)
    
    await waitFor(() => {
      expect(screen.getByText('Download Expired')).toBeInTheDocument()
      expect(screen.getByText('This link has expired. Please create a new export.')).toBeInTheDocument()
    })
  })

  it('should disable download button when countdown completes', async () => {
    const mockOnCountdownComplete = jest.fn()
    render(<DownloadLink {...defaultProps} onCountdownComplete={mockOnCountdownComplete} />)
    
    // Fast-forward time to trigger countdown completion
    jest.advanceTimersByTime(120000)
    
    await waitFor(() => {
      const downloadButton = screen.getByText('Download Expired')
      expect(downloadButton).toBeDisabled()
    })
  })

  it('should handle clipboard write failure gracefully', async () => {
    const mockWriteText = jest.fn().mockRejectedValue(new Error('Clipboard access denied'))
    navigator.clipboard.writeText = mockWriteText
    
    render(<DownloadLink {...defaultProps} />)
    
    const copyButton = screen.getAllByRole('button')[0] // First button is the copy button
    fireEvent.click(copyButton)
    
    // Should not show success message on failure
    expect(screen.queryByText('Link copied to clipboard!')).not.toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    render(<DownloadLink {...defaultProps} />)
    
    const card = document.querySelector('.rounded-lg')
    expect(card).toHaveClass('border-gray-200', 'bg-white')
  })

  it('should have expired styling when countdown completes', async () => {
    const mockOnCountdownComplete = jest.fn()
    render(<DownloadLink {...defaultProps} onCountdownComplete={mockOnCountdownComplete} />)
    
    // Fast-forward time to trigger countdown completion
    jest.advanceTimersByTime(120000)
    
    await waitFor(() => {
      const card = document.querySelector('.rounded-lg')
      expect(card).toHaveClass('border-red-200')
    })
  })
})
