### 什么是 Prisma？

Prisma 不仅仅是一个传统的 ORM (Object-Relational Mapper)，也是一个现代化的数据库工具箱，主要由三个核心部分组成：

1.  **Prisma Client**: 一个自动生成、类型安全的数据库查询构建器。你在应用程序代码中与之交互的就是它。
2.  **Prisma Migrate**: 一个声明式的数据建模和迁移系统。你只需要在 schema 文件中定义数据模型，Prisma 就会帮你生成和执行 SQL 迁移脚本。
3.  **Prisma Studio**: 一个现代化的 GUI，用于查看和编辑数据库中的数据。

Prisma 的最大优势是 **类型安全**。它会根据你的数据模型自动生成 TypeScript 类型，让你在编码时获得极佳的自动补全和编译时错误检查，有效杜绝了很多常见的数据库操作 bug。

### Prisma 核心工作流程

使用 Prisma 的基本流程非常清晰：

1.  **定义数据模型**: 在 `prisma/schema.prisma` 文件中用 Prisma 的建模语言 (PSL) 定义你的数据库表结构和关系。
2.  **迁移数据库**: 运行 `prisma migrate` 命令，Prisma 会将你的 schema 与数据库当前状态进行比较，生成 SQL 迁移文件，并应用到数据库。
3.  **生成客户端**: `migrate` 命令会自动运行 `prisma generate`，这个命令会根据你的 schema 生成一个完全类型安全的 Prisma Client。
4.  **在代码中使用客户端**: 在你的应用代码中（如 Node.js, Express, NestJS, Next.js），导入并使用 Prisma Client 来执行 CRUD 操作。

### 详细步骤：从零开始管理数据

让我们通过一个具体的例子来走一遍完整的流程。假设我们要创建一个简单的博客应用，包含 `User` (用户) 和 `Post` (文章) 两个模型。

#### 第 1 步：项目初始化和安装

1.  **创建一个新的 Node.js 项目**

    ```bash
    mkdir my-prisma-project
    cd my-prisma-project
    npm init -y
    npm install typescript ts-node @types/node --save-dev
    npx tsc --init
    ```

2.  **安装 Prisma CLI**

    ```bash
    npm install prisma --save-dev
    ```

3.  **初始化 Prisma 项目**

    这个命令会创建一个 `prisma` 文件夹，里面包含 `schema.prisma` 文件，并创建一个 `.env` 文件用于存放数据库连接字符串。

    ```bash
    npx prisma init
    ```
    
    现在你的项目结构看起来像这样：
    ```
    .
    ├── node_modules/
    ├── prisma/
    │   └── schema.prisma
    ├── .env
    ├── package.json
    └── tsconfig.json
    ```

#### 第 2 步：配置数据库连接和定义数据模型

1.  **配置数据库连接**

    打开 `.env` 文件，设置你的数据库连接字符串。Prisma 支持 PostgreSQL, MySQL, SQLite, SQL Server, MongoDB 等。这里我们用 PostgreSQL 举例：

    ```env
    # .env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
    ```

2.  **定义数据模型**

    打开 `prisma/schema.prisma` 文件，这是 Prisma 的核心。我们来定义 `User` 和 `Post` 模型。

    ```prisma
    // prisma/schema.prisma

    // 1. 指定数据源
    datasource db {
      provider = "postgresql" // 使用的数据库
      url      = env("DATABASE_URL") // 从 .env 文件读取连接字符串
    }

    // 2. 指定客户端生成器
    generator client {
      provider = "prisma-client-js" // 生成 JavaScript/TypeScript 客户端
    }

    // 3. 定义数据模型
    model User {
      id        Int      @id @default(autoincrement()) // 主键，自增
      email     String   @unique // 邮箱，唯一
      name      String?  // 名字，可选 (?)
      posts     Post[]   // 一个用户可以有多篇文章，建立一对多关系
      createdAt DateTime @default(now()) // 创建时间，默认为当前时间
    }

    model Post {
      id        Int      @id @default(autoincrement())
      title     String
      content   String?
      published Boolean  @default(false) // 是否已发布，默认为 false
      author    User     @relation(fields: [authorId], references: [id]) // 关系字段
      authorId  Int      // 外键
      createdAt DateTime @default(now())
    }
    ```
    - `@id`: 定义主键。
    - `@default()`: 设置默认值。
    - `@unique`: 设置唯一约束。
    - `@relation`: 定义模型间的关系。`fields` 指向当前模型的外键字段，`references` 指向关联模型的主键。

#### 第 3 步：运行数据库迁移

定义好模型后，我们需要让数据库的结构和模型保持同步。

```bash
# --name init 是这次迁移的名称，可以自定义
npx prisma migrate dev --name init
```

这个命令会做几件事：
1.  在 `prisma/migrations` 文件夹下创建一个新的迁移目录。
2.  生成 SQL 迁移文件（你可以查看它来了解具体会执行什么 SQL 语句）。
3.  将迁移应用到你的数据库，创建 `User` 和 `Post` 表。
4.  **自动运行 `npx prisma generate`**，生成最新的 Prisma Client。

#### 第 4 步：在代码中使用 Prisma Client 进行数据管理 (CRUD)

现在，激动人心的时刻到了！我们来编写代码操作数据库。

1.  **安装 Prisma Client**

    ```bash
    npm install @prisma/client
    ```

2.  **创建一个脚本文件**

    例如，创建一个 `script.ts` 文件。

    ```typescript
    // script.ts
    import { PrismaClient } from '@prisma/client';

    // 实例化 Prisma Client
    const prisma = new PrismaClient();

    async function main() {
      // 在这里编写你的数据库操作...

      // ===================================================
      // 1. 创建 (Create)
      // ===================================================
      console.log('--- 创建用户 ---');
      const newUser = await prisma.user.create({
        data: {
          name: 'Alice',
          email: 'alice@prisma.io',
        },
      });
      console.log('创建的新用户:', newUser);

      console.log('\n--- 创建文章并关联用户 ---');
      const newPost = await prisma.post.create({
        data: {
          title: 'Hello Prisma!',
          content: 'This is my first post with Prisma.',
          published: true,
          author: {
            connect: { email: 'alice@prisma.io' }, // 通过唯一的 email 字段关联
          },
        },
      });
      console.log('创建的新文章:', newPost);

      // ===================================================
      // 2. 读取 (Read)
      // ===================================================
      console.log('\n--- 查询所有用户 ---');
      const allUsers = await prisma.user.findMany();
      console.log(allUsers);

      console.log('\n--- 查询所有用户，并包含他们的文章 ---');
      const allUsersWithPosts = await prisma.user.findMany({
        include: {
          posts: true, // 包含关联的 posts
        },
      });
      console.dir(allUsersWithPosts, { depth: null });

      console.log('\n--- 查询单篇文章 (条件查询) ---');
      const specificPost = await prisma.post.findUnique({
        where: { id: newPost.id },
      });
      console.log(specificPost);
      
      console.log('\n--- 筛选已发布的文章 ---');
      const publishedPosts = await prisma.post.findMany({
          where: { published: true }
      });
      console.log(publishedPosts);

      // ===================================================
      // 3. 更新 (Update)
      // ===================================================
      console.log('\n--- 更新用户姓名 ---');
      const updatedUser = await prisma.user.update({
        where: { email: 'alice@prisma.io' },
        data: { name: 'Alice Smith' },
      });
      console.log('更新后的用户:', updatedUser);
      
      // ===================================================
      // 4. 删除 (Delete)
      // ===================================================
      console.log('\n--- 删除文章 ---');
      const deletedPost = await prisma.post.delete({
          where: { id: newPost.id }
      });
      console.log('已删除的文章:', deletedPost);

      console.log('\n--- 删除用户 (这会失败，因为还有文章关联着他) ---');
      // 注意：如果用户还有文章，直接删除会因外键约束而失败。
      // 需要先删除该用户的所有文章，或者在schema中设置级联删除。
      // const deletedUser = await prisma.user.delete({
      //     where: { email: 'alice@prisma.io' }
      // });
      // console.log('已删除的用户:', deletedUser);
    }

    main()
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .finally(async () => {
        // 在脚本结束时断开数据库连接
        await prisma.$disconnect();
      });
    ```

3.  **运行脚本**

    ```bash
    npx ts-node script.ts
    ```

    你将会在控制台看到每一步操作的输出结果。

### 更多高级用法

-   **筛选、排序和分页**:

    ```typescript
    const result = await prisma.post.findMany({
      where: {
        published: true,
        title: {
          contains: 'Prisma', // 标题包含 "Prisma"
        },
      },
      orderBy: {
        createdAt: 'desc', // 按创建时间降序
      },
      skip: 10, // 跳过前10条
      take: 5,  // 取5条
    });
    ```

-   **事务（Transactions）**:

    使用 `prisma.$transaction` 来确保一组操作要么全部成功，要么全部失败。
    ```typescript
    const [user, post] = await prisma.$transaction([
      prisma.user.create({ data: { name: 'Bob', email: 'bob@prisma.io' } }),
      prisma.post.create({ data: { title: 'Hello Bob' } }) // 这里会失败，因为缺少 authorId
    ]);
    // 因为第二个操作失败，第一个创建用户的操作也会被回滚。
    ```

-   **原生 SQL 查询**:

    当你需要执行 Prisma Client 不支持的复杂查询时，可以使用原生 SQL。
    ```typescript
    import { Prisma } from '@prisma/client';

    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT * FROM "User" WHERE name = ${'Alice'}`
    );
    ```

### 总结

使用 Prisma 进行数据管理的流程可以归纳为：

1.  **Schema-First**: 始终以 `schema.prisma` 文件作为你唯一的真实数据源。
2.  **Migrate**: 每次修改 schema 后，运行 `prisma migrate dev` 来同步数据库。
3.  **Generate**: Prisma 会自动为你生成最新的、类型安全的客户端。
4.  **Code**: 在你的代码中享受 TypeScript 带来的类型提示、自动补全和编译时安全检查，自信地进行数据库操作。

这种工作流极大地提升了开发效率和代码质量，是现代后端开发，特别是 TypeScript 生态中的绝佳选择。
