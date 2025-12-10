import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// A simple dummy component to test. 
// This proves that Jest can render React components successfully.
const SimpleMessage = () => <div>Hello Ceylotek</div>

describe('Simple Component', () => {
  it('renders the correct text', () => {
    // 1. Render the component in a virtual DOM
    render(<SimpleMessage />)
    
    // 2. Look for the text "Hello Ceylotek"
    const heading = screen.getByText('Hello Ceylotek')
    
    // 3. Assert that it exists in the document
    expect(heading).toBeInTheDocument()
  })
})