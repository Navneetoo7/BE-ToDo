
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


## Description

This is a NestJS-based ToDo application with a focus on clean architecture, robust data handling, and API documentation.

user can run docker compose i have added db config

## Key Features

- **User Management**:  Create, retrieve, and manage user accounts.
- **Task Management**:  Create, retrieve, update status, and delete tasks assigned to users.
- **Authentication**: Secure user authentication using JWT.
- **Validation**: Utilizes DTOs and class-validator for request body validation.
- **API Documentation**: Fully documented API endpoints with Swagger.
- **Base Entity**:  Abstract BaseEntity with timestamp and user tracking for auditing.
- **Soft Deletes**: Implements soft delete functionality.
- **User Interceptors**:  Subscribers automatically track user actions (create, update, delete).

swagger view 


<img width="1644" alt="Screenshot 2025-04-11 at 12 13 29 PM" src="https://github.com/user-attachments/assets/f33a1cf6-0069-4826-8a91-d39baa357138" />

<img width="1609" alt="Screenshot 2025-04-11 at 12 13 02 PM" src="https://github.com/user-attachments/assets/2bdd4608-e555-4fe9-946e-4e23681de4f3" />

<img width="1617" alt="Screenshot 2025-04-11 at 12 12 33 PM" src="https://github.com/user-attachments/assets/56e25f54-276a-4332-a6ea-9a2a32abed50" />



## Technologies

- [NestJS](https://nestjs.com/):  Progressive Node.js framework.
- [TypeScript](https://www.typescriptlang.org/):  Typed superset of JavaScript.
- [TypeORM](https://typeorm.io/):  ORM for database interaction.
- [PostgreSQL](https://www.postgresql.org/):  Relational database.
- [Swagger](https://swagger.io/): API documentation.
- [class-validator](https://github.com/typestack/class-validator):  Validation library.
- [class-transformer](https://github.com/typestack/class-transformer):  DTO transformation.
- [JWT](https://jwt.io/): JSON Web Tokens for authentication.

## Entities

- **UserEntity**: Represents a user account.

    ```
    @Entity('users')
    export class UserEntity extends BaseEntity {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      firstName: string;

      @Column()
      lastName: string;

      @Column({ unique: true })
      email: string;

      @Column()
      phoneNumber: string;

      @Column()
      profileImage: string;

      @Column({
        type: 'enum',
        enum: Gender,
      })
      gender: Gender;

      @OneToMany(() => TaskEntity, (task) => task.user)
      tasks: TaskEntity[];

      @Column({ type: 'varchar', length: 100 })
      password: string;
    }
    ```

- **TaskEntity**: Represents a task assigned to a user.

    ```
    @Entity('tasks')
    export class TaskEntity extends BaseEntity {
      @PrimaryGeneratedColumn('uuid')
      id: string;

      @Column()
      title: string;

      @Column()
      description: string;

      @Column({ type: 'timestamp' })
      deadline: Date;

      @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
      })
      status: TaskStatus;

      @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
      })
      priority: TaskPriority;

      @ManyToOne(() => UserEntity, (user) => user.tasks, { onDelete: 'CASCADE' })
      user: UserEntity;
    }
    ```

- **BaseEntity**: Abstract base class for entities, providing common fields.

    ```
    export abstract class BaseEntity extends TypeOrmBaseEntity {
      @CreateDateColumn({ type: 'timestamp' })
      createdAt: Date;

      @UpdateDateColumn({ type: 'timestamp' })
      updatedAt: Date;

      @DeleteDateColumn({ type: 'timestamp', nullable: true })
      deletedAt: Date;

      @ManyToOne(() => UserEntity, { nullable: true })
      createdBy: UserEntity;

      @ManyToOne(() => UserEntity, { nullable: true })
      updatedBy: UserEntity;

      @ManyToOne(() => UserEntity, { nullable: true })
      deletedBy: UserEntity;
    }
    ```

## Project Setup

$ npm install

text

## Running the Application

Development mode
$ npm run start:dev

Production mode
$ npm run start:prod

text

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup`: Register a new user.
- `POST /api/v1/auth/login`: Authenticate an existing user.

### Users
- `POST /api/v1/users`: Create a new user.
- `GET /api/v1/users?page={page}&limit={limit}`: Get all users (paginated).
- `GET /api/v1/users/:id`: Get user by ID.

### Tasks
- `POST /api/v1/tasks`: Create a new task.
- `GET /api/v1/tasks?page={page}&limit={limit}`: Get all tasks (paginated).
- `GET /api/v1/tasks/:id`: Get task by ID.
- `DELETE /api/v1/tasks/:id`: Delete a task by ID.
- `PATCH /api/v1/tasks/:id/status`: Update task status by ID.

## Usage with Swagger

1. Run the application in development mode (`npm run start:dev`).
2. Open your browser and navigate to `http://localhost:3000/api`.  (Adjust port if necessary)
3. You should see the Swagger UI with all available API endpoints and schemas.

## Base Entity Subscriber

The application uses a TypeORM subscriber (`BaseEntitySubscriber`) to automatically populate `createdBy`, `updatedBy`, and `deletedBy` fields whenever an entity extending `BaseEntity` is created, updated, or deleted.



