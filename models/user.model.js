const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const ROLE_ADMIN = 'ADMIN';
const ROLE_SUPERUSER = 'SUPERUSER';
const ROLE_USER = 'USER';
const ROLE_INVITED = 'INVITED';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'User needs a password'],
    match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/, 'Password: Minimum three characters, at least UpperCase, LowerCase and Number'],
    // match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password: Minimum eight characters, at least one letter and one number'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true
  },
  name: {
    type: String
  },
  familyname: {
    type: String
  },
  telephone: {
    type: String
  },
  about: {
    type: String
  },
  role: {
    type: String,
    enum: [ROLE_ADMIN, ROLE_SUPERUSER, ROLE_USER, ROLE_INVITED],
    default: ROLE_USER
  },
  friends: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  language: {
    type: String,
    default: "en"
  },
  photo: {
    type: String
  },
  expireSuperUser:{
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;

      return ret;
    }
  }
});

userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  if (user.isAdmin()) {
    user.role = 'ADMIN';
  }
  bcrypt.genSalt(SALT_WORK_FACTOR)
    .then(salt => {
      bcrypt.hash(user.password, salt)
        .then(hash => {
          user.password = hash;
          return next();
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

userSchema.methods.isAdmin = function () {
  return this.username === ROLE_ADMIN;
};

const User = mongoose.model('User', userSchema);
module.exports = User;