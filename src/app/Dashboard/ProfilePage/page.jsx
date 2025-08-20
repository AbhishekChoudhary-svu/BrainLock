"use client"

import { useContext, useEffect, useState } from "react"
import { ArrowLeft, Edit3, Save, X, User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Brain } from "lucide-react"
import Link from "next/link"
import MyContext from "@/context/ThemeProvider"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const context = useContext(MyContext)
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(null)

useEffect(() => {
  async function loadProfile() {

        setProfileData({
          name: `${context.user.firstName} ${context.user.lastName || ""}`,
          email: context.user.email || "",
          phone: context.user.phoneNumber || "",
          address: context.user.address || "N/A",
          dateOfBirth: context.user.dateOfBirth || "1990-01-01",
          role: context.user.role || "User",
          department: context.user.department || "General",
          joinDate: context.user.createdAt ? context.user.createdAt.split("T")[0] : "",
          bio: context.user.bio || "No bio provided.",
          qualifications: context.user.qualifications || "",
          subjects: context.user.subjects || [],
          createdAt: context.user.createdAt,
       
  })}

context.fetchProfile()
loadProfile()
}, [])

  const [editData, setEditData] = useState(null)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(profileData)
  }

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
    // TODO: Send editData to backend with PUT/PATCH API
    console.log("Profile updated:", editData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(profileData)
  }

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }


if (!profileData) {
  return <div className="p-8 text-center text-red-600">Failed to load profile.</div>
}


  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
       <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href=""
              onClick={() => router.back()}
              className="flex items-center space-x-3 text-gray-900 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold">Brain Lock</h1>
                <p className="text-xs text-gray-500">Profile Dashboard</p>
              </div>
            </Link>
            <Badge variant="secondary" className="text-sm">
              Edit / View Profile
            </Badge>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-gray-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <p className="text-blue-100 text-lg capitalize">
                  {profileData.role} - {profileData.department}
                </p>
                <p className="text-blue-200 text-sm">
                  Member since {new Date(profileData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h2>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.phone || "Not provided"}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      {isEditing ? (
                        <textarea
                          value={editData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.address}</p>
                      )}
                    </div>
                  </div>

                  {/* DOB */}
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {new Date(profileData.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Professional Information</h2>

                <div className="space-y-4">
                  {/* Department */}
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.department}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.department}</p>
                      )}
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.qualifications}
                          onChange={(e) => handleInputChange("qualifications", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.qualifications}</p>
                      )}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Teaching</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.subjects.join(", ")}
                        onChange={(e) => handleInputChange("subjects", e.target.value.split(", ").map(s => s.trim()))}
                        placeholder="Enter subjects separated by commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.subjects.length > 0 ? (
                          profileData.subjects.map((subject, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No subjects added</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
