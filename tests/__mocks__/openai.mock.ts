class MockOpenAI {
    chat = {
        completions: {
            create: jest.fn()
        }
    }
}

export default MockOpenAI;