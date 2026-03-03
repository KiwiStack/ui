<script>
	import '@kiwi/core/styles/global.css';
	import { setMailService } from '@kiwi/core/services/index';
	import { mailService } from '@kiwi/adapter-tauri';

	setMailService(mailService);

	let { children } = $props();
</script>

{@render children()}
