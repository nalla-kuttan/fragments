const { randomUUID } = require('crypto');
const rid = randomUUID();
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error(
        `Owner ID and type strings are required, got ownerID=${ownerId}, type=${type}`
      );
    }

    if (!id) {
      //const rid = randomUUID();
      this.id = rid;
    } else {
      this.id = id;
    }

    if (!this.constructor.isSupportedType(type)) {
      throw new Error(`Invalid types, only 'text/plain' is valid type, got type=${type}`);
    }

    if (typeof size != 'number' || size < 0) {
      throw new Error(`Size must be number and can not be negative number, got size=${size}`);
    }

    if (!created) {
      this.created = new Date().toISOString();
    } else {
      this.created = created;
    }

    if (!updated) {
      this.updated = new Date().toISOString();
    } else {
      this.updated = updated;
    }

    this.ownerId = ownerId;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    //returns an empty array if there are no fragments for this user, passes only ownerId
    // TODO
    return await listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error(`Size must be number and cannot be a negative number`);
    }
    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    // TODO
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    // TODO
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    if (!data) {
      throw new Error(`Buffer is required`);
    }
    this.updated = new Date().toISOString();
    this.size = data.length;
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    // TODO
    const type = this.mimeType;
    var flag;
    if (type.startsWith('text/')) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    const formats = ['text/plain'];
    return formats;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    var supported;
    if (value.startsWith('text/') || value === 'application/json') {
      supported = true;
    } else {
      supported = false;
    }
    return supported;
  }
}

module.exports.Fragment = Fragment;
