import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("taskdb"); // This will create/use a database named "taskdb"

  switch (req.method) {
    case "GET":
      // Fetch all tasks from the "tasks" collection
      const tasks = await db.collection("tasks").find({}).toArray();
      res.json({ status: 200, data: tasks });
      break;
    case "POST":
      try {
        // Parse the incoming request to get the task text
        const { text } = JSON.parse(req.body);
        // Create a new task object
        const newTask = { text, completed: false, createdAt: new Date() };
        // Insert the new task into the "tasks" collection
        const result = await db.collection("tasks").insertOne(newTask);
        res.json({ status: 200, data: result, message: "Task created!" });
      } catch (error) {
        res.status(500).json({ status: 500, message: "Error creating task", error });
      }
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
