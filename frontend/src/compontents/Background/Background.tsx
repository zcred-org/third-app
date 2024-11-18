export function Background() {
  return (
    <>
      <div className="absolute z-[-99] w-full h-full bg-[url(/images/noise.png)] [background-size:auto] mix-blend-hard-light bg-repeat"></div>
      <img className="absolute z-[-100] w-full h-full object-cover md:object-top brightness-75" src="/images/bg-img-pink.jpg" alt="" />
    </>
  );
}
