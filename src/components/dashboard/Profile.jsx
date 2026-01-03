import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { toastSuccess, toastError } from "../ui/Toast";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);

  const onSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toastError("Name is required");
    try {
      setSaving(true);
      await updateUserProfile(name.trim(), photo.trim());
      toastSuccess("Profile updated!");
    } catch (e2) {
      toastError(e2?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="opacity-70">Editable profile information.</p>
      </div>

      <form
        onSubmit={onSave}
        className="card bg-base-200 border border-base-300 rounded-2xl"
      >
        <div className="card-body space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Name</span>
              </label>
              <input
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Photo URL</span>
              </label>
              <input
                className="input input-bordered"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <input
              className="input input-bordered"
              value={user?.email || ""}
              readOnly
            />
          </div>

          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
