function StatsCard({ title, value, color, icon }) {

  return (
    <div className={`${color} p-6 rounded-3xl transition hover:shadow-md`}>

      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className="bg-white p-2.5 rounded-xl shadow-sm">
            {icon}
          </div>
        )}
        <p className="text-gray-500 text-sm font-medium">
          {title}
        </p>
      </div>

      <h2 className="text-2xl font-bold capitalize">
        {value}
      </h2>

    </div>
  );

}

export default StatsCard;