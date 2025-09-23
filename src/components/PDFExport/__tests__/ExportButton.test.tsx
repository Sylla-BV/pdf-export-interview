import { render, screen, fireEvent } from '@testing-library/react'
import { ExportButton } from '../ExportButton/ExportButton'
import type { ExportButtonProps } from '../ExportButton/ExportButton.types'

const defaultProps: ExportButtonProps = {
  buttonText: 'Export PDF',
  onExport: jest.fn(),
  isLoading: false,
  disabled: false,
}

describe('ExportButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with correct text', () => {
    render(<ExportButton {...defaultProps} />)
    
    expect(screen.getByText('Export PDF')).toBeInTheDocument()
  })

  it('should call onExport when clicked', () => {
    const mockOnExport = jest.fn()
    render(<ExportButton {...defaultProps} onExport={mockOnExport} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnExport).toHaveBeenCalledTimes(1)
  })

  it('should show loading state when isLoading is true', () => {
    render(<ExportButton {...defaultProps} isLoading={true} />)
    
    expect(screen.getByText('Processing PDF...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<ExportButton {...defaultProps} disabled={true} />)
    
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should not call onExport when disabled', () => {
    const mockOnExport = jest.fn()
    render(<ExportButton {...defaultProps} onExport={mockOnExport} disabled={true} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnExport).not.toHaveBeenCalled()
  })

  it('should not call onExport when loading', () => {
    const mockOnExport = jest.fn()
    render(<ExportButton {...defaultProps} onExport={mockOnExport} isLoading={true} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnExport).not.toHaveBeenCalled()
  })

  it('should have correct styling classes', () => {
    render(<ExportButton {...defaultProps} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'text-white')
  })

  it('should have loading styling when isLoading is true', () => {
    render(<ExportButton {...defaultProps} isLoading={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gradient-to-r', 'from-purple-600', 'to-pink-600')
    expect(button).toBeDisabled()
  })

  it('should have disabled styling when disabled is true', () => {
    render(<ExportButton {...defaultProps} disabled={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gradient-to-r', 'from-purple-600', 'to-pink-600')
    expect(button).toBeDisabled()
  })
})
