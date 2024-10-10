extern crate env_logger;
use actix_cors::Cors;
// use actix_web::{get, http, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_web::{get, http, App, HttpServer, Responder};
use actix_web::middleware::Logger;


// #[get("/index.html")]
// async fn index(req: HttpRequest) -> &'static str {
//     "<p>Hello World!</p>"
// }

#[get("/")]
async fn index() -> impl Responder {
    "Hello World"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=debug");
    env_logger::init();

    HttpServer::new(|| {
        let cors = Cors::default()
            // .allowed_origin("http://127.0.0.1:3000")
            .allowed_origin("http://localhost:3000")
            // .allowed_origin_fn(|origin, _req_head| {
            //     origin.as_bytes().ends_with(b".rust-lang.org")
            // })
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .service(index)
    })
    .bind(("rust", 8080))?
    .run()
    .await
}


