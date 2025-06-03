import { fetchAndTransformUsers } from './transform';

// ✅ ใช้ dynamic mock แทน node-fetch ESM
jest.mock('./transform', () => {
  const original = jest.requireActual('./transform');
  return {
    ...original,
    fetchAndTransformUsers: jest.fn(),
  };
});

const mockedTransform = fetchAndTransformUsers as jest.Mock;

describe('fetchAndTransformUsers', () => {
  it('returns correct summary', async () => {
    mockedTransform.mockResolvedValue({
      Engineering: {
        male: 1,
        female: 1,
        ageRange: '28-30',
        hair: { Black: 1, Brown: 1 },
        addressUser: {
          JohnDoe: '12345',
          JaneSmith: '67890',
        },
      },
    });

    const result = await fetchAndTransformUsers();

    expect(result.Engineering).toBeDefined();
    expect(result.Engineering.male).toBe(1);
    expect(result.Engineering.hair.Black).toBe(1);
  });
});
