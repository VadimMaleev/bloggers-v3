import "reflect-metadata";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import { Container } from "inversify";
import {PostsController} from "./Routes/controllers/posts-controller";
import {CommentsController} from "./Routes/controllers/comments-controller";
import {BlogsController} from "./Routes/controllers/blogs-controller";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./Routes/controllers/users-controller";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./Routes/controllers/auth-controller";
import {UsersRepository} from "./repositories/users-repository";
import {EmailService} from "./domain/email-service";
import {PairQuizGamesController} from "./Routes/controllers/pairQuizGame-controller";
import {PairQuizGamesService} from "./domain/pairQuizGame-service";
import {PairQuizGamesRepository} from "./repositories/pairQuizGame-repository";
import {SecurityController} from "./Routes/controllers/security-controller";
import {SecurityService} from "./domain/security-service";
import {SecurityQueryRepository} from "./repositories/query-repository/security-query-repository";
import {CommentsQueryRepository} from "./repositories/query-repository/comments-query-repository";


export const myContainer = new Container();
myContainer.bind<PostsController>(PostsController).to(PostsController);
myContainer.bind<PostsService>(PostsService).to(PostsService);
myContainer.bind<PostsRepository>(PostsRepository).to(PostsRepository);

myContainer.bind<BlogsController>(BlogsController).to(BlogsController);
myContainer.bind<BlogsService>(BlogsService).to(BlogsService);
myContainer.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository);

myContainer.bind<CommentsController>(CommentsController).to(CommentsController);
myContainer.bind<CommentsService>(CommentsService).to(CommentsService);
myContainer.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository);
myContainer.bind<CommentsQueryRepository>(CommentsQueryRepository).to(CommentsQueryRepository);

myContainer.bind<UsersController>(UsersController).to(UsersController);
myContainer.bind<UsersService>(UsersService).to(UsersService);
myContainer.bind<UsersRepository>(UsersRepository).to(UsersRepository);

myContainer.bind<AuthController>(AuthController).to(AuthController);
myContainer.bind<AuthService>(AuthService).to(AuthService);

myContainer.bind<EmailService>(EmailService).to(EmailService);

myContainer.bind<PairQuizGamesController>(PairQuizGamesController).to(PairQuizGamesController);
myContainer.bind<PairQuizGamesService>(PairQuizGamesService).to(PairQuizGamesService);
myContainer.bind<PairQuizGamesRepository>(PairQuizGamesRepository).to(PairQuizGamesRepository);

myContainer.bind<SecurityController>(SecurityController).to(SecurityController);
myContainer.bind<SecurityService>(SecurityService).to(SecurityService);
// myContainer.bind<SecurityRepository>(SecurityRepository).to(SecurityRepository);
myContainer.bind<SecurityQueryRepository>(SecurityQueryRepository).to(SecurityQueryRepository);