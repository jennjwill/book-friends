module.exports = class ApplicationPolicy {
  constructor(user, record) {
    this.user = user;
    this.record = record; //where does this come from???
  }

  _isOwner() {
    console.log("This record userId IS:", this.record.userId, this.user.id);
    return this.record && this.record.userId == this.user.id;
  }

  _isAdmin() {
    return this.user && this.user.role == "admin";
  }

  _isMember() {
    return this.user && this.user.role == "member";
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  edit() {
    return this.new() && this.record && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
};
