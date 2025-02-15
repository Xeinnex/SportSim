export function MainContainer() {
  return (
    <div className="w-8 h-8 border border-rose-800 flex justify-center items-center"></div>
  );
}

export default function Home() {
  return (
    <div className="bg-zinc-900 h-screen w-screen border border-lime-400">
      <MainContainer />
      <MainContainer />
    </div>
  );
}
