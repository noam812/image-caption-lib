const MockOpenAI = jest.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
}));

export default MockOpenAI;
