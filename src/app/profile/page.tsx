import { getUserProfile } from "@/api/get-user-profile";
import Image from "next/image";
import Navigation from "../components/navigation";
//
export default async function ProfilePage() {
  // const router = useRouter();
  // const [profile, setProfile] = useState({
  //   name: "Headangelly Huy",
  //   username: "headangelly",
  //   avatar: "/grid/img1.png", // Use image instead of letter avatar
  // });

  const profile = await getUserProfile();

  // const [activeTab, setActiveTab] = useState("created");
  // const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <div className='min-h-screen bg-white'>
      <Navigation />

      <div className='max-w-4xl mx-auto px-4 py-8 mt-7'>
        {/* Profile Header */}
        <div className='flex flex-col items-center space-y-4'>
          <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--primary-color)]'>
            <Image
              src={profile.profileImageUrl ?? ""}
              alt='Profile'
              width={100}
              height={100}
              className='w-full h-full object-cover rounded-full'
            />
          </div>
          <h1 className='text-3xl font-bold'>@{profile.username}</h1>
          <div className='flex gap-2'>
            <button className='px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold'>
              Share
            </button>
            <button
              // onClick={() => setIsEditProfileOpen(true)}
              className='px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold'
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        {/* <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}

        {/* Content Section */}
        <div className='mt-8 text-center'>
          <p className='text-gray-600 mb-4'>
            Nothing to show...yet! Start creating now.
          </p>
          {/* <button
            onClick={() => router.push("/upload")}
            className='px-6 py-3 rounded-full font-semibold text-white bg-[var(--primary-color)] hover:opacity-90'
          >
            Create Post
          </button> */}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {/* {isEditProfileOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updatedProfile) => {
            setProfile(updatedProfile);
            setIsEditProfileOpen(false);
          }}
        />
      )} */}
    </div>
  );
}
