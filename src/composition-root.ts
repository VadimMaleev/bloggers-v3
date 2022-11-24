import 'reflect-metadata'
import {Container} from "inversify";
import {BlogsController} from "./routers/controllers/blogs-controller";
import {BlogsService} from "./bll/blogs-service";
import {BlogsQueryRepository} from "./repositories/blogs-query-repository";
import {BlogsRepository} from "./repositories/blogs-repository";
import {PostsController} from "./routers/controllers/posts-controller";
import {PostsQueryRepository} from "./repositories/posts-query-repository";
import {PostsService} from "./bll/posts-service";
import {PostsRepository} from "./repositories/posts-repository";
import {UsersController} from "./routers/controllers/users-controller";
import {UsersQueryRepository} from "./repositories/users-query-repository";
import {UsersService} from "./bll/users-service";
import {AuthService} from "./bll/auth-service";
import {UsersRepository} from "./repositories/users-repository";
import {AuthController} from "./routers/controllers/auth-controller";

export const container = new Container()

container.bind<BlogsController>(BlogsController).to(BlogsController)
container.bind<BlogsService>('bs').to(BlogsService)
container.bind<BlogsQueryRepository>('bqr').to(BlogsQueryRepository);
container.bind<BlogsRepository>('br').to(BlogsRepository);

container.bind<PostsController>(PostsController).to(PostsController)
container.bind<PostsService>('ps').to(PostsService)
container.bind<PostsQueryRepository>('pqr').to(PostsQueryRepository);
container.bind<PostsRepository>('pr').to(PostsRepository)

container.bind<UsersController>(UsersController).to(UsersController)
container.bind<UsersService>('us').to(UsersService)
container.bind<UsersRepository>('ur').to(UsersRepository);
container.bind<UsersQueryRepository>('uqr').to(UsersQueryRepository);

container.bind<AuthController>(AuthController).to(AuthController)
container.bind<AuthService>('as').to(AuthService)
