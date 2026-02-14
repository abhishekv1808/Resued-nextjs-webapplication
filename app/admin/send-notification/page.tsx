"use client";

import { useState, useRef, useEffect } from "react";

export default function SendNotificationPage() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<
    { _id: string; name: string; phone?: string; email?: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");

  // Previews
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Refs for file inputs and form
  const formRef = useRef<HTMLFormElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    inputRef: React.RefObject<HTMLInputElement | null>,
    setPreview: (url: string | null) => void,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (inputRef.current) {
        // Set the file to the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputRef.current.files = dataTransfer.files;
      }
      // Update preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (
    inputRef: React.RefObject<HTMLInputElement | null>,
    setPreview: (url: string | null) => void,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); // Prevent triggering click on parent
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPreview(null);
  };

  // Load available tags and locations for targeting
  useEffect(() => {
    async function loadTargetingData() {
      try {
        const res = await fetch("/api/admin/notification-targets");
        if (res.ok) {
          const data = await res.json();
          setAvailableTags(data.tags || []);
          setAvailableLocations(data.locations || []);
        }
      } catch {
        // Non-critical, selects will just be empty
      }
    }
    loadTargetingData();
  }, []);

  // Search users for specific targeting
  const searchUsers = async (query: string) => {
    setUserSearchQuery(query);
    if (query.length < 2) {
      setUserSearchResults([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/notification-targets?searchUser=${encodeURIComponent(query)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setUserSearchResults(data.users || []);
      }
    } catch {
      setUserSearchResults([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    // Collect selected tag checkboxes into a comma-separated string
    if (audience === "by_tags") {
      const checkedTags = Array.from(
        e.currentTarget.querySelectorAll<HTMLInputElement>(
          'input[name="tag_checkbox"]:checked',
        ),
      ).map((cb) => cb.value);
      formData.set("tags", checkedTags.join(","));
    }
    formData.delete("tag_checkbox"); // Clean up individual checkbox values

    try {
      const response = await fetch("/api/admin/send-notification", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Notification sent successfully!");
        // Reset form using formRef
        if (formRef.current) {
          formRef.current.reset();
        }
        setBannerPreview(null);
        setIconPreview(null);
        setAudience("all");
        setSelectedUserId("");
        setSelectedUserName("");
        setUserSearchQuery("");
        setUserSearchResults([]);

        // Show success message for 3 seconds then clear
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {/* Success Modal / Toast */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm w-full mx-4 animate-scale-up">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 text-3xl shadow-sm">
              <i className="ri-checkbox-circle-fill"></i>
            </div>
            <h3 className="text-xl font-bold text-[var(--admin-text-main)] mb-2">
              Success!
            </h3>
            <p className="text-[var(--admin-text-muted)] text-center">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm">
        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[var(--admin-border)] flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold text-[var(--admin-text-main)] font-heading">
            Send Push Notification
          </h2>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-4 md:p-6">
          {errorMessage && (
            <div
              className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
              role="alert"
            >
              <i className="ri-error-warning-fill"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-8">
            {/* Section 1: Notification Details */}
            <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                <i className="ri-notification-3-line text-[#0a2e5e]"></i>{" "}
                Notification Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                    Target Audience
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-group-line text-gray-400"></i>
                    </div>
                    <select
                      name="audience"
                      value={audience}
                      onChange={(e) => {
                        setAudience(e.target.value);
                        setSelectedUserId("");
                        setSelectedUserName("");
                      }}
                      className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                    >
                      <option value="all">All Subscribers</option>
                      <option value="registered_users">
                        Registered Users Only
                      </option>
                      <option value="specific_user">Specific User</option>
                      <option value="cart_abandonment">Cart Abandonment</option>
                      <option value="by_tags">By Tags / Segments</option>
                      <option value="by_location">By Location</option>
                      <option value="inactive_users">Inactive Users</option>
                      <option value="purchase_history">Past Buyers</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i className="ri-arrow-down-s-line text-gray-400"></i>
                    </div>
                  </div>
                </div>

                {/* Conditional: Specific User Search */}
                {audience === "specific_user" && (
                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                      Search User
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-search-line text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        value={selectedUserName || userSearchQuery}
                        onChange={(e) => {
                          setSelectedUserName("");
                          searchUsers(e.target.value);
                        }}
                        className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="Search by name, phone, or email..."
                      />
                      <input
                        type="hidden"
                        name="userId"
                        value={selectedUserId}
                      />
                    </div>
                    {selectedUserId && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                        <i className="ri-checkbox-circle-fill"></i>
                        <span>
                          Selected: <strong>{selectedUserName}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUserId("");
                            setSelectedUserName("");
                            setUserSearchQuery("");
                          }}
                          className="ml-auto text-gray-400 hover:text-red-500"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    )}
                    {userSearchResults.length > 0 && !selectedUserId && (
                      <div className="mt-2 bg-white border border-[var(--admin-border)] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {userSearchResults.map((u) => (
                          <button
                            key={u._id}
                            type="button"
                            onClick={() => {
                              setSelectedUserId(u._id);
                              setSelectedUserName(
                                u.name + (u.phone ? ` (${u.phone})` : ""),
                              );
                              setUserSearchResults([]);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {u.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {u.phone || u.email || "No contact info"}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Conditional: Tags */}
                {audience === "by_tags" && (
                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                      Select Tags
                    </label>
                    {availableTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                          <label
                            key={tag}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--admin-hover)] border border-[var(--admin-border)] rounded-full text-sm cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors has-[:checked]:bg-blue-100 has-[:checked]:border-blue-400 has-[:checked]:text-blue-700"
                          >
                            <input
                              type="checkbox"
                              name="tag_checkbox"
                              value={tag}
                              className="w-3.5 h-3.5 rounded accent-blue-600"
                            />
                            <span className="font-medium">{tag}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--admin-text-muted)] italic">
                        No tags found. Add tags to users first.
                      </p>
                    )}
                    {/* Hidden input populated by JS */}
                    <input type="hidden" name="tags" id="selectedTags" />
                  </div>
                )}

                {/* Conditional: Location */}
                {audience === "by_location" && (
                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-map-pin-line text-gray-400"></i>
                      </div>
                      {availableLocations.length > 0 ? (
                        <>
                          <select
                            name="location"
                            className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                          >
                            <option value="">Select location...</option>
                            {availableLocations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i className="ri-arrow-down-s-line text-gray-400"></i>
                          </div>
                        </>
                      ) : (
                        <input
                          type="text"
                          name="location"
                          className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="e.g. Bangalore"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Conditional: Inactive Days */}
                {audience === "inactive_users" && (
                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                      Inactive For (Days)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-time-line text-gray-400"></i>
                      </div>
                      <input
                        type="number"
                        name="inactiveDays"
                        defaultValue={7}
                        min={1}
                        max={365}
                        className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                    <p className="text-xs text-[var(--admin-text-muted)] mt-1">
                      Users who haven&apos;t logged in for this many days
                    </p>
                  </div>
                )}

                {/* Audience description hint */}
                <div className="flex items-start gap-2 text-xs text-[var(--admin-text-muted)] bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                  <i className="ri-information-line text-blue-500 mt-0.5"></i>
                  <span>
                    {audience === "all" &&
                      "Sends to every device that subscribed to push notifications (including non-logged-in visitors)."}
                    {audience === "registered_users" &&
                      "Sends only to users who have an account and are subscribed to push."}
                    {audience === "specific_user" &&
                      "Sends to a single user's subscribed device(s). Search and select a user above."}
                    {audience === "cart_abandonment" &&
                      "Sends to users who currently have items in their cart but haven't checked out."}
                    {audience === "by_tags" &&
                      "Sends to users matching any of the selected tags. Tags are assigned automatically on purchase or manually by admin."}
                    {audience === "by_location" &&
                      "Sends to users whose saved location matches the selected city/area."}
                    {audience === "inactive_users" &&
                      "Sends to users who haven't logged in for the specified number of days. Great for re-engagement."}
                    {audience === "purchase_history" &&
                      "Sends to all users who have made at least one successful purchase."}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                    Notification Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-notification-badge-line text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="title"
                      className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-colors"
                      placeholder="e.g. Big Sale Starting Now!"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                    Message Body
                  </label>
                  <div className="relative">
                    <textarea
                      name="body"
                      rows={4}
                      className="w-full bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                      placeholder="e.g. Get 50% off on all Laptops. Limited time offer."
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Media */}
            <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                <i className="ri-image-line text-orange-500"></i> Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Large Image (Banner) */}
                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                    Large Image (Banner)
                  </label>
                  <div
                    className="w-full h-[200px] border-2 border-dashed border-[var(--admin-border)] hover:border-blue-500 rounded-xl flex flex-col items-center justify-center bg-[var(--admin-hover)]/30 transition-all cursor-pointer relative overflow-hidden group"
                    onClick={() => bannerInputRef.current?.click()}
                    onDrop={(e) =>
                      handleDrop(e, bannerInputRef, setBannerPreview)
                    }
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      name="image"
                      ref={bannerInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setBannerPreview)}
                    />

                    {bannerPreview ? (
                      <div className="w-full h-full relative group">
                        <img
                          src={bannerPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                          onClick={(e) =>
                            removeFile(bannerInputRef, setBannerPreview, e)
                          }
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center pointer-events-none">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <i className="ri-image-line text-2xl text-[#29abe2]"></i>
                        </div>
                        <p className="text-[var(--admin-text-main)] font-medium text-sm">
                          Banner Image
                        </p>
                        <p className="text-[var(--admin-text-muted)] text-xs mt-1">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notification Icon */}
                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                    Notification Icon (Optional)
                  </label>
                  <div
                    className="w-full h-[200px] border-2 border-dashed border-[var(--admin-border)] hover:border-blue-500 rounded-xl flex flex-col items-center justify-center bg-[var(--admin-hover)]/30 transition-all cursor-pointer relative overflow-hidden group"
                    onClick={() => iconInputRef.current?.click()}
                    onDrop={(e) => handleDrop(e, iconInputRef, setIconPreview)}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      name="icon"
                      ref={iconInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setIconPreview)}
                    />

                    {iconPreview ? (
                      <div className="w-full h-full relative group">
                        <img
                          src={iconPreview}
                          alt="Preview"
                          className="w-full h-full object-contain p-4"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                          onClick={(e) =>
                            removeFile(iconInputRef, setIconPreview, e)
                          }
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center pointer-events-none">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <i className="ri-notification-badge-line text-2xl text-purple-500"></i>
                        </div>
                        <p className="text-[var(--admin-text-main)] font-medium text-sm">
                          Small Icon
                        </p>
                        <p className="text-[var(--admin-text-muted)] text-xs mt-1">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Actions & Links */}
            <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--admin-text-main)] mb-4 flex items-center gap-2">
                <i className="ri-links-line text-green-500"></i> Actions & Links
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-2">
                    Target URL (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-link text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="url"
                      className="w-full pl-10 bg-[var(--admin-hover)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-colors"
                      placeholder="e.g. /laptops or https://reused.in/offers"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Action 1 */}
                  <div className="p-4 bg-[var(--admin-hover)]/30 rounded-xl border border-[var(--admin-border)]">
                    <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                        1
                      </span>
                      Action Button 1
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-[var(--admin-text-muted)] mb-1">
                          Button Title
                        </label>
                        <input
                          type="text"
                          name="action1_title"
                          className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="e.g. View Offer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--admin-text-muted)] mb-1">
                          Action URL
                        </label>
                        <input
                          type="text"
                          name="action1_url"
                          className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="e.g. /offers"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action 2 */}
                  <div className="p-4 bg-[var(--admin-hover)]/30 rounded-xl border border-[var(--admin-border)]">
                    <h4 className="text-sm font-bold text-[var(--admin-text-main)] mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                        2
                      </span>
                      Action Button 2
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-[var(--admin-text-muted)] mb-1">
                          Button Title
                        </label>
                        <input
                          type="text"
                          name="action2_title"
                          className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="e.g. Call Now"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--admin-text-muted)] mb-1">
                          Action URL
                        </label>
                        <input
                          type="text"
                          name="action2_url"
                          className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="e.g. tel:+1234567890"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[var(--admin-border)] flex justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg bg-[#0a2e5e] hover:bg-[#29abe2] text-white text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-fill"></i> Send Notification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
