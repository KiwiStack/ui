#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::mail_search,
            commands::mail_read,
            commands::mail_send,
            commands::mail_list_mailboxes,
            commands::mail_move,
            commands::mail_delete,
            commands::mail_update,
            commands::mail_download_attachment,
            commands::mail_get_vacation,
            commands::mail_set_vacation,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
