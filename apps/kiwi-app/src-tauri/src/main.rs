#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::mail_search,
            commands::mail_read,
            commands::mail_send,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
