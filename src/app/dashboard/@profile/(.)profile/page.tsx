import { Suspense } from "react";
import { ProfileModal } from "../../profile/_components/profile.dialog";
import { ProfileContentTabs } from "../../profile/_components/profile..content.tabs";

// An interception route to render the profile page as a modal
export default function ProfileModalPage() {
  return (
    <Suspense>
      <ProfileModal>
        <ProfileContentTabs />
      </ProfileModal>
    </Suspense>
  );
}
