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

export const container = new Container()

container.bind<BlogsController>(BlogsController).to(BlogsController)
container.bind<BlogsService>('bs').to(BlogsService)
container.bind<BlogsQueryRepository>('bqr').to(BlogsQueryRepository);
container.bind<BlogsRepository>('br').to(BlogsRepository);

container.bind<PostsController>(PostsController).to(PostsController)
container.bind<PostsService>('ps').to(PostsService)
container.bind<PostsQueryRepository>('pqr').to(PostsQueryRepository);
container.bind<PostsRepository>('pr').to(PostsRepository)