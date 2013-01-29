// Generated by CoffeeScript 1.4.0
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Hoodie.Share = (function() {

  function Share(hoodie) {
    var api;
    this.hoodie = hoodie;
    this._open = __bind(this._open, this);

    this.instance = Hoodie.ShareInstance;
    api = this._open;
    $.extend(api, this);
    this.hoodie.store.decoratePromises({
      shareAt: this._storeShareAt,
      unshareAt: this._storeUnshareAt,
      unshare: this._storeUnshare,
      share: this._storeShare
    });
    return api;
  }

  Share.prototype.add = function(options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return this.hoodie.store.add('$share', this._filterShareOptions(options)).pipe(function(object) {
      if (!_this.hoodie.account.hasAccount()) {
        _this.hoodie.account.anonymousSignUp();
      }
      return new _this.instance(_this.hoodie, object);
    });
  };

  Share.prototype.find = function(id) {
    var _this = this;
    return this.hoodie.store.find('$share', id).pipe(function(object) {
      return new _this.instance(_this.hoodie, object);
    });
  };

  Share.prototype.findAll = function() {
    var _this = this;
    return this.hoodie.store.findAll('$share').pipe(function(objects) {
      var obj, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        obj = objects[_i];
        _results.push(new _this.instance(_this.hoodie, obj));
      }
      return _results;
    });
  };

  Share.prototype.findOrAdd = function(id, options) {
    var _this = this;
    return this.hoodie.store.findOrAdd('$share', id, this._filterShareOptions(options)).pipe(function(object) {
      if (!_this.hoodie.account.hasAccount()) {
        _this.hoodie.account.anonymousSignUp();
      }
      return new _this.instance(_this.hoodie, object);
    });
  };

  Share.prototype.save = function(id, options) {
    var _this = this;
    return this.hoodie.store.save('$share', id, this._filterShareOptions(options)).pipe(function(object) {
      return new _this.instance(_this.hoodie, object);
    });
  };

  Share.prototype.update = function(id, changed_options) {
    var _this = this;
    return this.hoodie.store.update('$share', id, this._filterShareOptions(changed_options)).pipe(function(object) {
      return new _this.instance(_this.hoodie, object);
    });
  };

  Share.prototype.updateAll = function(changed_options) {
    var _this = this;
    return this.hoodie.store.updateAll('$share', this._filterShareOptions(changed_options)).pipe(function(objects) {
      var obj, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        obj = objects[_i];
        _results.push(new _this.instance(_this.hoodie, obj));
      }
      return _results;
    });
  };

  Share.prototype.remove = function(id) {
    this.hoodie.store.findAll(function(obj) {
      return obj.$shares[id];
    }).unshareAt(id);
    return this.hoodie.store.remove('$share', id);
  };

  Share.prototype.removeAll = function() {
    this.hoodie.store.findAll(function(obj) {
      return obj.$shares;
    }).unshare();
    return this.hoodie.store.removeAll('$share');
  };

  Share.prototype._allowedOptions = ["id", "access", "$createdBy"];

  Share.prototype._filterShareOptions = function(options) {
    var filteredOptions, option, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    filteredOptions = {};
    _ref = this._allowedOptions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      if (options.hasOwnProperty(option)) {
        filteredOptions[option] = options[option];
      }
    }
    return filteredOptions;
  };

  Share.prototype._open = function(shareId, options) {
    if (options == null) {
      options = {};
    }
    $.extend(options, {
      id: shareId
    });
    return new this.instance(this.hoodie, options);
  };

  Share.prototype._storeShareAt = function(shareId, properties) {
    var _this = this;
    return this.pipe(function(objects) {
      var object, updateObject, _i, _len, _results;
      updateObject = function(object) {
        object.$shares || (object.$shares = {});
        object.$shares[shareId] = properties || true;
        _this.hoodie.store.update(object.$type, object.id, {
          $shares: object.$shares
        });
        return object;
      };
      if ($.isArray(objects)) {
        _results = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          object = objects[_i];
          _results.push(updateObject(object));
        }
        return _results;
      } else {
        return updateObject(objects);
      }
    });
  };

  Share.prototype._storeUnshareAt = function(shareId) {
    var _this = this;
    return this.pipe(function(objects) {
      var object, updateObject, _i, _len, _results;
      updateObject = function(object) {
        if (!(object.$shares && object.$shares[shareId])) {
          return object;
        }
        object.$shares[shareId] = false;
        _this.hoodie.store.update(object.$type, object.id, {
          $shares: object.$shares
        });
        return object;
      };
      if ($.isArray(objects)) {
        _results = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          object = objects[_i];
          _results.push(updateObject(object));
        }
        return _results;
      } else {
        return updateObject(objects);
      }
    });
  };

  Share.prototype._storeUnshare = function() {
    var _this = this;
    return this.pipe(function(objects) {
      var object, updateObject, _i, _len, _results;
      updateObject = function(object) {
        var shareId;
        if (!object.$shares) {
          return object;
        }
        for (shareId in object.$shares) {
          object.$shares[shareId] = false;
        }
        _this.hoodie.store.update(object.$type, object.id, {
          $shares: object.$shares
        });
        return object;
      };
      if ($.isArray(objects)) {
        _results = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          object = objects[_i];
          _results.push(updateObject(object));
        }
        return _results;
      } else {
        return updateObject(objects);
      }
    });
  };

  Share.prototype._storeShare = function(properties) {
    var _this = this;
    return this.pipe(function(objects) {
      return _this.hoodie.share.add().pipe(function(newShare) {
        var object, updateObject, value;
        updateObject = function(object) {
          object.$shares || (object.$shares = {});
          object.$shares[newShare.id] = properties || true;
          _this.hoodie.store.update(object.$type, object.id, {
            $shares: object.$shares
          });
          return object;
        };
        value = (function() {
          var _i, _len, _results;
          if ($.isArray(objects)) {
            _results = [];
            for (_i = 0, _len = objects.length; _i < _len; _i++) {
              object = objects[_i];
              _results.push(updateObject(object));
            }
            return _results;
          } else {
            return updateObject(objects);
          }
        })();
        return _this.hoodie.defer().resolve(value, newShare).promise();
      });
    });
  };

  return Share;

})();

Hoodie.extend('share', Hoodie.Share);
