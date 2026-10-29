import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("home");

  // Public profile
  const [publicProfile, setPublicProfile] = useState(null);
  const [publicProfileLoading, setPublicProfileLoading] = useState(false);
  const [publicProfileError, setPublicProfileError] = useState("");

  // Authentication fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Professional profile fields
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");

  // Application status
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // A URL such as /yojitha represents a public profile.
  const pathSlug = decodeURIComponent(
    window.location.pathname.slice(1)
  );

  const isPublicProfilePath = Boolean(pathSlug);

  // Load a public profile when someone visits its URL.
  useEffect(() => {
    if (!pathSlug) {
      return;
    }

    const controller = new AbortController();

    async function loadPublicProfile() {
      setPublicProfileLoading(true);
      setPublicProfileError("");

      try {
        const response = await fetch(
          `${API_URL}/api/profile/public/${encodeURIComponent(pathSlug)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Public profile not found"
          );
        }

        setPublicProfile(data.therapist);
      } catch (error) {
        if (error.name !== "AbortError") {
          setPublicProfileError(
            error.message || "Unable to load public profile"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setPublicProfileLoading(false);
        }
      }
    }

    loadPublicProfile();

    return () => controller.abort();
  }, [pathSlug]);

  // Register or log in.
  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    const isRegister = page === "register";
    const endpoint = isRegister ? "register" : "login";

    const requestBody = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const response = await fetch(
        `${API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }

      if (isRegister) {
        setMessage(data.message || "Account created successfully!");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        sessionStorage.setItem(
          "theraflowToken",
          data.token
        );

        sessionStorage.setItem(
          "theraflowTherapist",
          JSON.stringify(data.therapist)
        );

        setMessage("");
        setPage("dashboard");
      }
    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the server"
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Navigate between the application's pages.
  function changePage(newPage) {
    setPage(newPage);
    setMessage("");
    setName("");
    setEmail("");
    setPassword("");
  }

  // Load the authenticated therapist's saved profile.
  async function loadMyProfile() {
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/profile/me`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(
              "theraflowToken"
            )}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load profile"
        );
      }

      setQualification(
        data.therapist.qualification || ""
      );

      setSpecialization(
        data.therapist.specialization || ""
      );

      setBio(data.therapist.bio || "");

      setPage("profile");
    } catch (error) {
      setMessage(
        error.message || "Unable to load profile"
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Save changes to the authenticated therapist's profile.
  async function handleProfileSave(event) {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/profile/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem(
              "theraflowToken"
            )}`,
          },
          body: JSON.stringify({
            qualification,
            specialization,
            bio,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save profile"
        );
      }

      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the server"
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Retrieve the current therapist's profile from the backend.
  async function getMyProfileData() {
    const response = await fetch(
      `${API_URL}/api/profile/me`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            "theraflowToken"
          )}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load profile"
      );
    }

    return data.therapist;
  }

  // Open the public profile in a new browser tab.
  async function handleViewPublicProfile() {
    setMessage("");

    try {
      const therapist = await getMyProfileData();

      if (!therapist.slug) {
        setMessage("Please save your profile first.");
        return;
      }

      const profileUrl =
        `${window.location.origin}/${encodeURIComponent(
          therapist.slug
        )}`;

      window.open(profileUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setMessage(
        error.message || "Unable to open public profile"
      );
    }
  }

  // Copy the public profile URL to the clipboard.
  async function handleCopyProfileLink() {
    setMessage("");

    try {
      const therapist = await getMyProfileData();

      if (!therapist.slug) {
        setMessage("Please save your profile first.");
        return;
      }

      const profileUrl =
        `${window.location.origin}/${encodeURIComponent(
          therapist.slug
        )}`;

      await navigator.clipboard.writeText(profileUrl);

      setMessage("Public profile link copied!");
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to copy the link. Please try again."
      );
    }
  }

  // Log out.
  function handleLogout() {
    sessionStorage.removeItem("theraflowToken");
    sessionStorage.removeItem("theraflowTherapist");

    setMessage("");
    setPage("home");
  }

  // Public profile page: show only the public profile.
  if (isPublicProfilePath) {
    return (
      <div className="app">
        <main className="register public-profile">
          {publicProfileLoading && (
            <p>Loading public profile...</p>
          )}

          {publicProfileError && (
            <>
              <h1>Profile unavailable</h1>
              <p role="alert">{publicProfileError}</p>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Back to Home
              </button>
            </>
          )}

          {publicProfile && (
            <>
              <p>THERAFLOW PROFESSIONAL PROFILE</p>

              <h1>{publicProfile.name}</h1>

              {publicProfile.qualification && (
                <h3>{publicProfile.qualification}</h3>
              )}

              {publicProfile.specialization && (
                <p>
                  <strong>Specialization:</strong>{" "}
                  {publicProfile.specialization}
                </p>
              )}

              {publicProfile.bio && (
                <p>{publicProfile.bio}</p>
              )}

              <p>Professional Profile — TheraFlow</p>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Back to Home
              </button>
            </>
          )}
        </main>
      </div>
    );
  }

  // Main application.
  return (
    <div className="app">
      <nav className="navbar">
        <h2>TheraFlow</h2>

        <div>
          <button
            type="button"
            onClick={() => changePage("home")}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => changePage("login")}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => changePage("register")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Home page */}
      {page === "home" && (
        <section className="hero">
          <p>YOUR PRACTICE, SIMPLIFIED</p>

          <h1>Better care. Better connections.</h1>

          <p>
            Manage appointments, organize client information,
            and simplify your professional practice.
          </p>

          <button
            type="button"
            onClick={() => changePage("register")}
          >
            Get Started
          </button>
        </section>
      )}

      {/* Dashboard */}
      {page === "dashboard" && (
        <section className="hero">
          <p>THERAFLOW DASHBOARD</p>

          <h1>
            Welcome,{" "}
            {JSON.parse(
              sessionStorage.getItem(
                "theraflowTherapist"
              ) || "{}"
            ).name || "Therapist"}
            !
          </h1>

          <p>You are successfully logged in.</p>

          <div className="dashboard-actions">
            <button
              type="button"
              onClick={loadMyProfile}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "My Profile"}
            </button>

            <button
              type="button"
              onClick={handleViewPublicProfile}
            >
              View Public Profile
            </button>

            <button
              type="button"
              onClick={handleCopyProfileLink}
            >
              Copy Profile Link
            </button>

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {message && <p role="status">{message}</p>}
        </section>
      )}

      {/* Edit professional profile */}
      {page === "profile" && (
        <section className="register">
          <h1>My Professional Profile</h1>

          <p>Manage your professional information.</p>

          <form onSubmit={handleProfileSave}>
            <label htmlFor="qualification">
              Qualification
            </label>

            <input
              id="qualification"
              value={qualification}
              onChange={(event) =>
                setQualification(event.target.value)
              }
              placeholder="e.g. B.Tech Computer Science"
              required
            />

            <label htmlFor="specialization">
              Specialization
            </label>

            <input
              id="specialization"
              value={specialization}
              onChange={(event) =>
                setSpecialization(event.target.value)
              }
              placeholder="e.g. Web Development, AI/ML, Cybersecurity"
              required
            />

            <label htmlFor="bio">
              Professional Biography
            </label>

            <textarea
              id="bio"
              value={bio}
              onChange={(event) =>
                setBio(event.target.value)
              }
              placeholder="Describe your technical skills, projects, and experience"
              rows={5}
              maxLength={1000}
            />

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Profile"}
            </button>

            {message && <p role="status">{message}</p>}

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setPage("dashboard");
              }}
            >
              Back to Dashboard
            </button>
          </form>
        </section>
      )}

      {/* Registration and login */}
      {(page === "register" || page === "login") && (
        <section className="register">
          <h1>
            {page === "register"
              ? "Create Your Therapist Account"
              : "Welcome Back"}
          </h1>

          <p>
            {page === "register"
              ? "Join TheraFlow to manage your practice."
              : "Log in to your TheraFlow account."}
          </p>

          <form onSubmit={handleSubmit}>
            {page === "register" && (
              <>
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </>
            )}

            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={8}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : page === "register"
                  ? "Create Account"
                  : "Login"}
            </button>

            {message && <p role="status">{message}</p>}
          </form>

          <p>
            {page === "register"
              ? "Already registered? "
              : "New to TheraFlow? "}

            <button
              type="button"
              onClick={() =>
                changePage(
                  page === "register"
                    ? "login"
                    : "register"
                )
              }
            >
              {page === "register"
                ? "Login"
                : "Create Account"}
            </button>
          </p>
        </section>
      )}
    </div>
  );
}

export default App;