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
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailSummary {
    pub id: String,
    pub from: Vec<Address>,
    pub to: Vec<Address>,
    pub subject: String,
    pub received_at: String,
    pub preview: String,
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
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchParams {
    pub query: Option<String>,
    pub mailbox: Option<String>,
    pub from: Option<String>,
    pub after: Option<String>,
    pub before: Option<String>,
    pub limit: Option<u32>,
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
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SendResult {
    pub id: String,
    pub status: String,
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
