import { db } from "../src/utils/db.server";

interface myuser {
  name: string;
  email: string;
  password: string;
}

type mytask = {
  task_description: string;
  due_date: Date;
  complete: boolean;
};

async function seed() {
  await Promise.all(
    getUsers().map((user: myuser) => {
      return db.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });
    })
  );
  const user = await db.user.findFirst({
    where: {
      name: "Yuval Noah",
    },
  });

  if (user) {
    await Promise.all(
      getTasks().map((task: mytask) => {
        const { task_description, due_date, complete } = task;
        return db.task.create({
          data: {
            task_description,
            due_date,
            complete,
            userId: user.id,
          },
        });
      })
    );
  }
}

seed();

function getUsers(): Array<myuser> {
  return [
    {
      name: "John",
      email: "test@example.com",
      password: "testpassword",
    },
    {
      name: "William",
      email: "test2@example.com",
      password: "testpassword",
    },
    {
      name: "Yuval Noah",
      email: "test1@example.com",
      password: "testpassword",
    },
  ];
}

function getTasks(): Array<mytask> {
  return [
    {
      task_description: "my task",
      due_date: new Date(),
      complete: false,
    },
    {
      task_description: "my task 1 ",
      due_date: new Date(),
      complete: false,
    },
    {
      task_description: "my task 2",
      due_date: new Date(),
      complete: false,
    },
  ];
}
