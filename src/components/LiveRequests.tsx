import { Button } from "../components/ui/button"

const sampleRequests = [
  {
    id: 1,
    item: "LED Bulbs",
    quantity: 500,
    deadline: "June 30, 2024",
    budget: "$2,000",
  },
  {
    id: 2,
    item: "Office Chairs",
    quantity: 50,
    deadline: "July 10, 2024",
    budget: "$4,500",
  },
  {
    id: 3,
    item: "Laptops (i5, 16GB)",
    quantity: 20,
    deadline: "July 5, 2024",
    budget: "$15,000",
  },
  {
    id: 4,
    item: "Printer Paper (A4)",
    quantity: 10000,
    deadline: "June 25, 2024",
    budget: "$1,200",
  },
  {
    id: 5,
    item: "Coffee Beans",
    quantity: 200,
    deadline: "July 1, 2024",
    budget: "$800",
  },
  {
    id: 6,
    item: "Solar Panels (400W)",
    quantity: 100,
    deadline: "July 15, 2024",
    budget: "$35,000",
  }
]

export function LiveRequests() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-white">Live Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {sampleRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-lg border border-gray-800 bg-gray-900 p-6 flex flex-col gap-4 shadow-sm"
            >
              <div className="font-semibold text-lg text-white">{req.item}</div>
              <div className="text-gray-400 text-sm">Quantity: <span className="text-white font-medium">{req.quantity}</span></div>
              <div className="text-gray-400 text-sm">Needed by: <span className="text-white font-medium">{req.deadline}</span></div>
              <div className="text-gray-400 text-sm">Budget: <span className="text-white font-medium">{req.budget}</span></div>
              <Button variant="outline" className="mt-2">View Details</Button>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild size="lg">
            <a href="/post-request">Tell Us What You Want</a>
          </Button>
        </div>
      </div>
    </section>
  )
} 