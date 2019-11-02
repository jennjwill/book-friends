const ApplicationPolicy = require("./application");

module.exports = class BookPolicy extends ApplicationPolicy {
  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  edit() {
    console.log("USER is:", this.user);
    return this.new && (this._isOwner() || this._isAdmin());
    //return this.new && this._isAdmin;
  }

  update() {
    // return this.new && (this._isOwner() || this._isAdmin());
    return this.new && this._isAdmin;
  }

  destroy() {
    // return this.new && (this._isOwner() || this._isAdmin());
    return this.new && this._isAdmin;
  }
};
