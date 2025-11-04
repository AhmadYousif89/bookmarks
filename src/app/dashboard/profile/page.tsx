import { ProfileContentTabs } from "./_components/profile..content.tabs";

export default function ProfilePage() {
  return (
    <section className="flex grow flex-col gap-5 p-4 pb-16 md:p-8 md:pb-16">
      <ProfileContentTabs />
    </section>
  );
}
