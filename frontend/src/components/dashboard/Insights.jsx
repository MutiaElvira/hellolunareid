function Insights() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-5">
        Insights For You 💡
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-r from-pink-200 to-rose-200 p-6 rounded-3xl text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-20">🌷</div>
          <h3 className="text-2xl font-bold mb-3">
            PMS Self Care
          </h3>
          <p className="text-white/90">
            Learn how to reduce cramps and improve your mood naturally.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-6 rounded-3xl text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-6xl opacity-20">🌙</div>
          <h3 className="text-2xl font-bold mb-3">
            Hormonal Health
          </h3>
          <p className="text-white/90">
            Discover healthy habits to balance hormones and sleep better.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Insights;
