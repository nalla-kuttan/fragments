const { createSuccessResponse, createErrorResponse } = require('../../src/response');
const { Fragment } = require('../../src/model/fragment');
const updateFragment = require('../../src/routes/api/put');

jest.mock('../../src/response');
jest.mock('../../src/model/fragment');
jest.mock('../../src/logger');

describe('PUT /fragments/:id', () => {
  const req = {
    params: {
      id: 'test-id'
    },
    user: {
      id: 'test-user-id'
    },
    get: jest.fn().mockReturnValue('application/json'),
    body: {
      fragment: 'updated fragment data'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updates existing fragment with matching type', async () => {
    const mockFragment = {
      type: 'application/json',
      setData: jest.fn(),
    };
    Fragment.byId.mockResolvedValue(mockFragment);

    await updateFragment(req, res);

    expect(Fragment.byId).toHaveBeenCalledWith(req.user, req.params.id);
    expect(req.get).toHaveBeenCalledWith('Content-Type');
    expect(mockFragment.setData).toHaveBeenCalledWith(req.body.fragment);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      createSuccessResponse({
        status: 'ok',
        fragment: mockFragment,
      })
    );
  });

  test('returns 400 if request Content-Type does not match fragment type', async () => {
    const mockFragment = {
      type: 'application/xml',
    };
    Fragment.byId.mockResolvedValue(mockFragment);

    await updateFragment(req, res);

    expect(Fragment.byId).toHaveBeenCalledWith(req.user, req.params.id);
    expect(req.get).toHaveBeenCalledWith('Content-Type');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      createErrorResponse(400, "The type does not match the fragment's saved type")
    );
  });

  test('returns 404 if no fragment found with given id', async () => {
    Fragment.byId.mockRejectedValue(new Error('Fragment not found'));

    await updateFragment(req, res);

    expect(Fragment.byId).toHaveBeenCalledWith(req.user, req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(createErrorResponse(404, 'Fragment not found'));
  });
});
