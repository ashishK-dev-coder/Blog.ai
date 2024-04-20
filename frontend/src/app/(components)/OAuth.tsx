import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";

import useStore from "../zustand/store";
import { useRouter } from "next/navigation";

export default function OAuth() {
  const signInSuccess = useStore((state) => state.signInSuccess);

  const router = useRouter();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log("result oauth", result);
      const res = await fetch("http://localhost:8881/api/v1/users/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      signInSuccess(data);
      // Redirect to profile page with a query parameter indicating successful authentication

      router.push("/")
    } catch (error) {
      console.log("could not login with google", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white w-full py-3 rounded-md hover:bg-red-500 transition duration-300 ease-in-out mt-2"
    >
      Continue with google
    </button>
  );
}
