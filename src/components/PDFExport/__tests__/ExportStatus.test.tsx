import { render, screen } from '@testing-library/react'
import { ExportStatus } from '@/types/pdf-export'
import { ExportStatus as ExportStatusComponent } from '../ExportStatus/ExportStatus'

describe('ExportStatus', () => {
  it('should render processing status', () => {
    render(<ExportStatusComponent status={ExportStatus.PROCESSING} />)
    
    expect(screen.getByText('Processing')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should render failed status without error message', () => {
    render(<ExportStatusComponent status={ExportStatus.FAILED} />)
    
    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
  })

  it('should render failed status with error message', () => {
    const errorMessage = 'Network connection failed'
    render(<ExportStatusComponent status={ExportStatus.FAILED} errorMessage={errorMessage} />)
    
    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should have correct styling for processing status', () => {
    render(<ExportStatusComponent status={ExportStatus.PROCESSING} />)
    
    const badge = screen.getByText('Processing')
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-200')
  })

  it('should have correct styling for failed status', () => {
    render(<ExportStatusComponent status={ExportStatus.FAILED} />)
    
    const badge = screen.getByText('Failed')
    expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'border-red-200')
  })

  it('should display loading spinner for processing status', () => {
    render(<ExportStatusComponent status={ExportStatus.PROCESSING} />)
    
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('should not display spinner for failed status', () => {
    render(<ExportStatusComponent status={ExportStatus.FAILED} />)
    
    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).not.toHaveClass('animate-spin')
  })

  it('should handle long error messages gracefully', () => {
    const longErrorMessage = 'This is a very long error message that should be handled gracefully by the component without breaking the layout or causing any visual issues'
    render(<ExportStatusComponent status={ExportStatus.FAILED} errorMessage={longErrorMessage} />)
    
    expect(screen.getByText(longErrorMessage)).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })
})
