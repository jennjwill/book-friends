const ApplicationPolicy = require("./application");

module.exports = class BookPolicy extends ApplicationPolicy {
  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  edit() {
    // console.log("EDIT BOOK policy USER is:", this.user);
    // return this.new && (this._isOwner() || this._isAdmin());
    return this.new;
  }

  update() {
    // console.log("UPDATE BOOK policy User is:", this.user);
    // return this.new && (this._isOwner() || this._isAdmin());
    return this.new;
  }

  destroy() {
    // return this.new && (this._isOwner() || this._isAdmin());
    return this.new;
  }
};
