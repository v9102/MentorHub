import mongoose from "mongoose";

const examDetailSchema = new mongoose.Schema({

  examName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  college: {
    type: String,
    trim: true,
    index: true
  },

  rank: {
    type: String,
    trim: true,
    index: true
  },

  percentile: {
    type: String,
    trim: true,
    index: true
  },

  attempts: {
    type: String,
    trim: true
  },

  interview: {
    type: String,
    trim: true
  },

  selectionYear: {
    type: String,
    trim: true,
    index: true
  }

}, { _id: true });


const UserSchema = new mongoose.Schema({

  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  name: {
    type: String,
    trim: true,
    index: true
  },

  username: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },

  imageUrl: String,

  role: {
    type: String,
    enum: ["student", "mentor", "admin"],
    default: "student",
    index: true
  },

  languages: [{
    type: String,
    trim: true,
    index: true
  }]
  ,
  mentorProfile: {

    basicInfo: {
      gender: String,
      currentOrganisation: {
        type: String,
        index: true
      },
      industry: {
        type: String,
        index: true
      },
      currentRole: {
        type: String,
        index: true
      },
      workExperience: {
        type: Number,
        index: true
      },
      profilePhoto: String
    },

    professionalInfo: {
      highestQualification: String,
      college: {
        type: String,
        index: true
      },
      branch: String,
      passingYear: Number
    },

    expertise: {
      subjects: [{
        type: String,
        index: true
      }],
      specializations: {
        type: String,
        index: true
      }
    },

    availability: [
      {
        day: {
          type: String,
          enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          required: true,
          index: true
        },

        slots: [
          {
            startTime: {
              type: String,
              required: true
            },

            endTime: {
              type: String,
              required: true
            },

            sessionDuration: {
              type: Number,
              required: true,
              default: 15
            }
          }
        ]
      }
    ],

    upcomingSessions: [
      {
        date: {
          type: Date,
          required: true,
          index: true
        },

        startTime: {
          type: String,
          required: true
        },

        endTime: {
          type: String,
          required: true
        },

        sessionDuration: {
          type: Number,
          required: true
        },

        isBooked: {
          type: Boolean,
          default: false,
          index: true
        },

        bookedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null
        }
      }
    ],

    pricing: {
      pricePerSession: {
        type: Number,
        index: true
      },
      sessionDuration: Number,
      isFreeTrialEnabled: Boolean
    },

    examDetails: [examDetailSchema],

    bio: String,

    languages: [String],

    rating: {
      type: Number,
      default: 0,
      index: true
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    verification: {
      idType: String,
      idNumber: String,
      documentUrl: String,
      isVerified: {
        type: Boolean,
        default: false,
        index: true
      },
      applicationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        index: true
      }
    }

  },

  isProfileComplete: {
    type: Boolean,
    default: false,
    index: true
  }

}, { timestamps: true });


UserSchema.index({
  name: "text",
  "mentorProfile.basicInfo.currentOrganisation": "text",
  "mentorProfile.basicInfo.currentRole": "text",
  "mentorProfile.professionalInfo.college": "text",
  "mentorProfile.expertise.subjects": "text",
  "mentorProfile.expertise.specializations": "text",
  "mentorProfile.examDetails.examName": "text",
  languages: "text",
  "mentorProfile.examDetails.college": "text"
});


const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

export default User;