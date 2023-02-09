const {
    writeFragment,
    readFragment,
    writeFragmentData,
    readFragmentData,
  } = require('../../src/model/data/memory/index.js');
  
  describe('memory/index.js functions', () => {
    const fauxfrag1 = { ownerId: 'f1', id: '1', fragment: 'This is the F1 metadata' };
    const fauxfrag2 = { ownerId: 'f1', id: '2', fragment: 'This is the F2 metadata' };
    test('Write data and metadata to the In-Memory DB', async () => {
      // Create 3 fake fragments, and put some data in each
      // fragment1 metadata and data
      await writeFragment(fauxfrag1);
      await writeFragmentData('f1', '1', 'This is fragment 1');
      // fragment2 metadata and data
      await writeFragment(fauxfrag2);
      await writeFragmentData('f1', '2', 'This is fragment 2');
    });

    test('readFragment', async () => {
      expect(await readFragment('f1', '1')).toEqual(fauxfrag1);
    });
  
    test('readFragmentData', async () => {
      expect(await readFragmentData('f1', '1')).toEqual('This is fragment 1');
    });
  });