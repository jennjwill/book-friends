const ApplicationPolicy = require("./application");

module.exports = class BookPolicy extends ApplicationPolicy {
  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  edit() {
    return this.new && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.new && (this._isOwner() || this._isAdmin());
  }

  destroy() {
    return this.new && (this._isOwner() || this._isAdmin());
  }
};
