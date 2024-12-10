// src/__mocks__/axios.js
const mockAxios = {
    get: jest.fn(() => Promise.resolve({ data: [
      { id: 1, name: 'Product 1', description: 'Description 1', category: 'Category 1', unit: 'Unit 1' },
      { id: 2, name: 'Product 2', description: 'Description 2', category: 'Category 2', unit: 'Unit 2' },
    ] })),
  };
  
  export default mockAxios;
  