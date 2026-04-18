"use client";

const TopSellingMealsTable = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-muted rounded-xl p-4 h-full shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Top Selling Meals</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-foreground">
            <tr>
              <th className="py-2">Meal</th>
              <th className="py-2">Orders</th>
              <th className="py-2">Revenue (₵)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((meal, i) => (
              <tr key={meal.name} className="border-t hover:bg-muted transition">
                <td className="py-3 font-medium">
                  #{i + 1} {meal.name}
                </td>
                <td className="py-3">{meal.orders}</td>
                <td className="py-3 font-semibold">₵{meal.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingMealsTable;
