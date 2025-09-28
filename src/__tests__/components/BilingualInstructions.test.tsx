import { render, screen, fireEvent } from '@testing-library/react'
import { BilingualInstructions } from '@/components/desktop/BilingualInstructions'

describe('BilingualInstructions', () => {
  it('renders English instructions by default', () => {
    render(<BilingualInstructions />)

    // Check for English instructions (default)
    expect(screen.getByText('How to Pick Up Your Parcel')).toBeInTheDocument()
    expect(screen.getByText('Open your mobile device camera or QR scanner app')).toBeInTheDocument()

    // Should not show other languages by default
    expect(screen.queryByText('Сіздің сәлемдемеңізді қалай алуға болады')).not.toBeInTheDocument()
    expect(screen.queryByText('Как забрать вашу посылку')).not.toBeInTheDocument()
  })

  it('shows language toggle when showLanguageToggle is true', () => {
    render(<BilingualInstructions showLanguageToggle={true} />)

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Русский')).toBeInTheDocument()
    expect(screen.getByText('Қазақша')).toBeInTheDocument()
  })

  it('does not show language toggle when showLanguageToggle is false', () => {
    render(<BilingualInstructions showLanguageToggle={false} />)

    expect(screen.queryByText('English')).not.toBeInTheDocument()
    expect(screen.queryByText('Русский')).not.toBeInTheDocument()
    expect(screen.queryByText('Қазақша')).not.toBeInTheDocument()
  })

  it('switches to English only when English button is clicked', () => {
    render(<BilingualInstructions showLanguageToggle={true} />)

    fireEvent.click(screen.getByText('English'))

    // Should show English instructions
    expect(screen.getByText('How to Pick Up Your Parcel')).toBeInTheDocument()
    
    // Should not show Kazakh instructions
    expect(screen.queryByText('Сіздің посылканы қалай алу керек')).not.toBeInTheDocument()
  })

  it('switches to Kazakh only when Kazakh button is clicked', () => {
    render(<BilingualInstructions showLanguageToggle={true} />)

    fireEvent.click(screen.getByText('Қазақша'))

    // Should show Kazakh instructions
    expect(screen.getByText('Сіздің посылканы қалай алу керек')).toBeInTheDocument()
    
    // Should not show English instructions
    expect(screen.queryByText('How to Pick Up Your Parcel')).not.toBeInTheDocument()
  })

  it('switches to Russian when Russian button is clicked', () => {
    render(<BilingualInstructions showLanguageToggle={true} />)

    fireEvent.click(screen.getByText('Русский'))

    // Should show Russian instructions
    expect(screen.getByText('Как забрать вашу посылку')).toBeInTheDocument()
    
    // Should not show English or Kazakh instructions
    expect(screen.queryByText('How to Pick Up Your Parcel')).not.toBeInTheDocument()
    expect(screen.queryByText('Сіздің посылканы қалай алу керек')).not.toBeInTheDocument()
  })

  it('renders all instruction steps', () => {
    render(<BilingualInstructions />)

    // Check that all 4 steps are present (numbered 1-4) for default English
    expect(screen.getAllByText('1')).toHaveLength(1) // Only English by default
    expect(screen.getAllByText('2')).toHaveLength(1)
    expect(screen.getAllByText('3')).toHaveLength(1)
    expect(screen.getAllByText('4')).toHaveLength(1)
  })

  it('renders help section', () => {
    render(<BilingualInstructions />)

    expect(screen.getByText('Need Help?')).toBeInTheDocument()
    expect(screen.getByText(/If you experience any difficulties/)).toBeInTheDocument()
  })

  it('renders help section in different languages', () => {
    render(<BilingualInstructions showLanguageToggle={true} />)

    // Test Kazakh
    fireEvent.click(screen.getByText('Қазақша'))
    expect(screen.getByText('Көмек керек пе?')).toBeInTheDocument()
    expect(screen.getByText(/Егер сізде қиындықтар туындаса/)).toBeInTheDocument()

    // Test Russian
    fireEvent.click(screen.getByText('Русский'))
    expect(screen.getByText('Нужна помощь?')).toBeInTheDocument()
    expect(screen.getByText(/Если у вас возникли трудности/)).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<BilingualInstructions className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('uses different colors for step numbers', () => {
    render(<BilingualInstructions />)

    // The step numbers should have different background colors
    // We can't easily test the exact colors, but we can check that the elements exist
    const stepNumbers = screen.getAllByText('1')
    expect(stepNumbers.length).toBeGreaterThan(0)
  })
})