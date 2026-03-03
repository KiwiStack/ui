<script lang="ts">
	import { type ServiceId, services } from '../../data/services';
	import { assistantMessages as mailMessages, assistantActions as mailActions } from '../../data/mail';
	import { assistantMessages as chatMessages, assistantActions as chatActions } from '../../data/chat';
	import { assistantMessages as meetMessages, assistantActions as meetActions } from '../../data/meet';
	import { assistantMessages as docsMessages, assistantActions as docsActions } from '../../data/docs';
	import { assistantMessages as workMessages, assistantActions as workActions } from '../../data/work';
	import { assistantMessages as storeMessages, assistantActions as storeActions } from '../../data/store';
	import { assistantMessages as searchMessages, assistantActions as searchActions } from '../../data/search';

	import Sidebar from './Sidebar.svelte';
	import Menubar from './Menubar.svelte';
	import ListPane from './ListPane.svelte';
	import AssistantPanel from './AssistantPanel.svelte';

	// Service-specific components
	import MailInboxList from '../mail/MailInboxList.svelte';
	import MailReader from '../mail/MailReader.svelte';
	import MailCompose from '../mail/MailCompose.svelte';
	import MailConfigList from '../mail/MailConfigList.svelte';
	import MailAutoReply from '../mail/MailAutoReply.svelte';
	import ChatChannelList from '../chat/ChatChannelList.svelte';
	import ChatPostDraft from '../chat/ChatPostDraft.svelte';
	import MeetList from '../meet/MeetList.svelte';
	import MeetNewMeeting from '../meet/MeetNewMeeting.svelte';
	import DocsList from '../docs/DocsList.svelte';
	import DocsRetrospective from '../docs/DocsRetrospective.svelte';
	import WorkList from '../work/WorkList.svelte';
	import WorkKanban from '../work/WorkKanban.svelte';
	import StoreList from '../store/StoreList.svelte';
	import StoreMoveFiles from '../store/StoreMoveFiles.svelte';
	import SearchList from '../search/SearchList.svelte';
	import SearchResults from '../search/SearchResults.svelte';

	let activeService: ServiceId = $state('mail');
	let activeMenus: Record<ServiceId, string> = $state({
		mail: 'Inbox',
		chat: 'Channels',
		meet: 'Upcoming',
		docs: 'Recent',
		work: 'Board',
		store: 'All Files',
		search: 'All',
	});

	// Per-service list selection state
	let selectedEmailId: string | null = $state(null);
	let mailConfigItem = $state('auto-reply');
	let chatChannel = $state('engineering');
	let meetMeeting = $state('sprint-review');
	let docsDoc = $state('retrospective');
	let workView = $state('todo');
	let storeFolder = $state('projects');
	let searchQuery = $state('deployment');

	let currentService = $derived(services[activeService]);
	let currentMenu = $derived(activeMenus[activeService]);

	const allMessages: Record<ServiceId, { role: 'user' | 'ai'; content: string }[]> = {
		mail: mailMessages,
		chat: chatMessages,
		meet: meetMessages,
		docs: docsMessages,
		work: workMessages,
		store: storeMessages,
		search: searchMessages,
	};

	const allActions: Record<ServiceId, { id: string; label: string; icon: string; color: string }[]> = {
		mail: mailActions,
		chat: chatActions,
		meet: meetActions,
		docs: docsActions,
		work: workActions,
		store: storeActions,
		search: searchActions,
	};

	function handleServiceChange(id: ServiceId) {
		activeService = id;
	}

	function handleMenuChange(tab: string) {
		activeMenus[activeService] = tab;
	}
</script>

<div class="app-shell" data-service={activeService}>
	<Sidebar {activeService} onServiceChange={handleServiceChange} />

	<Menubar
		tabs={[...currentService.menus]}
		activeTab={currentMenu}
		serviceColor={currentService.color}
		onTabChange={handleMenuChange}
	/>

	<ListPane>
		{#if activeService === 'mail' && currentMenu === 'Configuration'}
			<MailConfigList activeItem={mailConfigItem} onItemChange={(id) => mailConfigItem = id} />
		{:else if activeService === 'mail'}
			<MailInboxList activeEmail={selectedEmailId} onEmailChange={(id) => selectedEmailId = id} />
		{:else if activeService === 'chat'}
			<ChatChannelList activeChannel={chatChannel} onChannelChange={(id) => chatChannel = id} />
		{:else if activeService === 'meet'}
			<MeetList activeMeeting={meetMeeting} onMeetingChange={(id) => meetMeeting = id} />
		{:else if activeService === 'docs'}
			<DocsList activeDoc={docsDoc} onDocChange={(id) => docsDoc = id} />
		{:else if activeService === 'work'}
			<WorkList activeView={workView} onViewChange={(id) => workView = id} />
		{:else if activeService === 'store'}
			<StoreList activeFolder={storeFolder} onFolderChange={(id) => storeFolder = id} />
		{:else if activeService === 'search'}
			<SearchList activeQuery={searchQuery} onQueryChange={(id) => searchQuery = id} />
		{/if}
	</ListPane>

	<main class="content-panel" style="--service-color: {currentService.color}">
		{#if activeService === 'mail' && currentMenu === 'Configuration'}
			<MailAutoReply />
		{:else if activeService === 'mail' && currentMenu === 'Drafts'}
			<MailCompose />
		{:else if activeService === 'mail' && selectedEmailId}
			<MailReader emailId={selectedEmailId} />
		{:else if activeService === 'mail'}
			<div class="empty-state">Select an email to read</div>
		{:else if activeService === 'chat'}
			<ChatPostDraft />
		{:else if activeService === 'meet'}
			<MeetNewMeeting />
		{:else if activeService === 'docs'}
			<DocsRetrospective />
		{:else if activeService === 'work'}
			<WorkKanban />
		{:else if activeService === 'store'}
			<StoreMoveFiles />
		{:else if activeService === 'search'}
			<SearchResults />
		{/if}
	</main>

	<AssistantPanel
		messages={allMessages[activeService]}
		actions={allActions[activeService]}
	/>
</div>

<style>
	.app-shell {
		display: grid;
		grid-template-columns: 64px 260px 1fr 300px;
		grid-template-rows: auto 1fr;
		height: 100vh;
		background: var(--app-bg);
		overflow: hidden;
	}
	.content-panel {
		overflow-y: auto;
		height: 100%;
	}
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--text-muted);
		font-family: var(--font-body);
		font-size: 0.95rem;
	}
</style>
