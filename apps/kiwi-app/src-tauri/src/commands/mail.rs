use serde::{Deserialize, Serialize};

const MAIL_API: &str = "http://10.10.10.111:8443";

#[derive(Debug, Serialize, Deserialize)]
pub struct Address {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Attachment {
    pub name: String,
    #[serde(rename = "type")]
    pub content_type: String,
    pub size: u64,
    #[serde(default)]
    pub blob_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailSummary {
    pub id: String,
    pub from: Vec<Address>,
    pub to: Vec<Address>,
    pub subject: String,
    pub received_at: String,
    pub preview: String,
    #[serde(default)]
    pub is_read: bool,
    #[serde(default)]
    pub is_flagged: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailDetail {
    pub id: String,
    pub from: Vec<Address>,
    pub to: Vec<Address>,
    #[serde(default)]
    pub cc: Vec<Address>,
    pub subject: String,
    pub received_at: String,
    pub body: String,
    #[serde(default)]
    pub attachments: Vec<Attachment>,
    #[serde(default)]
    pub message_id: Option<String>,
    #[serde(default)]
    pub in_reply_to: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchParams {
    pub query: Option<String>,
    pub mailbox: Option<String>,
    pub from: Option<String>,
    pub after: Option<String>,
    pub before: Option<String>,
    pub limit: Option<u32>,
    #[serde(default)]
    pub sort_by: Option<String>,
    #[serde(default)]
    pub ascending: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SendParams {
    pub to: Vec<String>,
    #[serde(default)]
    pub cc: Vec<String>,
    #[serde(default)]
    pub bcc: Vec<String>,
    pub subject: String,
    pub body: String,
    #[serde(default)]
    pub in_reply_to: Option<String>,
    #[serde(default)]
    pub references: Option<String>,
    #[serde(default)]
    pub format: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SendResult {
    pub id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Mailbox {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub role: Option<String>,
    #[serde(default)]
    pub total_emails: u64,
    #[serde(default)]
    pub unread_emails: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailUpdate {
    #[serde(default)]
    pub is_read: Option<bool>,
    #[serde(default)]
    pub is_flagged: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VacationResponse {
    pub is_enabled: bool,
    #[serde(default)]
    pub from_date: Option<String>,
    #[serde(default)]
    pub to_date: Option<String>,
    #[serde(default)]
    pub subject: Option<String>,
    #[serde(default)]
    pub text_body: Option<String>,
    #[serde(default)]
    pub html_body: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ApiResponse<T> {
    data: T,
}

#[tauri::command]
pub async fn mail_search(params: SearchParams) -> Result<Vec<EmailSummary>, String> {
    let client = reqwest::Client::new();
    let resp = client
        .post(format!("{MAIL_API}/api/v1/mail/search"))
        .json(&params)
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    let envelope: ApiResponse<Vec<EmailSummary>> = resp
        .json()
        .await
        .map_err(|e| format!("Parse error: {e}"))?;

    Ok(envelope.data)
}

#[tauri::command]
pub async fn mail_read(id: String, format: String) -> Result<EmailDetail, String> {
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("{MAIL_API}/api/v1/mail/{id}"))
        .query(&[("format", &format)])
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    let envelope: ApiResponse<EmailDetail> = resp
        .json()
        .await
        .map_err(|e| format!("Parse error: {e}"))?;

    Ok(envelope.data)
}

#[tauri::command]
pub async fn mail_send(params: SendParams) -> Result<SendResult, String> {
    let client = reqwest::Client::new();
    let resp = client
        .post(format!("{MAIL_API}/api/v1/mail/send"))
        .json(&params)
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    let envelope: ApiResponse<SendResult> = resp
        .json()
        .await
        .map_err(|e| format!("Parse error: {e}"))?;

    Ok(envelope.data)
}

#[tauri::command]
pub async fn mail_list_mailboxes() -> Result<Vec<Mailbox>, String> {
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("{MAIL_API}/api/v1/mailboxes"))
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    let envelope: ApiResponse<Vec<Mailbox>> = resp
        .json()
        .await
        .map_err(|e| format!("Parse error: {e}"))?;

    Ok(envelope.data)
}

#[tauri::command]
pub async fn mail_move(id: String, mailbox_id: String) -> Result<(), String> {
    let client = reqwest::Client::new();
    let resp = client
        .post(format!("{MAIL_API}/api/v1/mail/{id}/move"))
        .json(&serde_json::json!({ "mailbox_id": mailbox_id }))
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    Ok(())
}

#[tauri::command]
pub async fn mail_delete(id: String) -> Result<(), String> {
    let client = reqwest::Client::new();
    let resp = client
        .delete(format!("{MAIL_API}/api/v1/mail/{id}"))
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    Ok(())
}

#[tauri::command]
pub async fn mail_update(id: String, updates: EmailUpdate) -> Result<(), String> {
    let client = reqwest::Client::new();
    let resp = client
        .patch(format!("{MAIL_API}/api/v1/mail/{id}"))
        .json(&updates)
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    Ok(())
}

#[tauri::command]
pub async fn mail_download_attachment(
    email_id: String,
    blob_id: String,
    filename: String,
) -> Result<(), String> {
    let client = reqwest::Client::new();
    let resp = client
        .get(format!(
            "{MAIL_API}/api/v1/mail/{email_id}/attachments/{blob_id}"
        ))
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    let bytes = resp.bytes().await.map_err(|e| format!("Read error: {e}"))?;

    // Save to user's download directory
    if let Some(download_dir) = dirs::download_dir() {
        let path = download_dir.join(&filename);
        std::fs::write(&path, &bytes).map_err(|e| format!("Write error: {e}"))?;
    } else {
        return Err("Could not determine download directory".to_string());
    }

    Ok(())
}

#[tauri::command]
pub async fn mail_get_vacation() -> Result<VacationResponse, String> {
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("{MAIL_API}/api/v1/mail/vacation"))
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    let envelope: ApiResponse<VacationResponse> = resp
        .json()
        .await
        .map_err(|e| format!("Parse error: {e}"))?;

    Ok(envelope.data)
}

#[tauri::command]
pub async fn mail_set_vacation(vacation: VacationResponse) -> Result<(), String> {
    let client = reqwest::Client::new();
    let resp = client
        .put(format!("{MAIL_API}/api/v1/mail/vacation"))
        .json(&vacation)
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Server error: {}", resp.status()));
    }

    Ok(())
}
