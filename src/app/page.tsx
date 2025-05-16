import Layout from "@/components/layout";

export default function HomePage() {
  return (
    <Layout>
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <h2 className="text-4xl font-bold text-blue-700">
            Welcome to your Dashboard!
          </h2>
        </div>
    </Layout>
  );
}


