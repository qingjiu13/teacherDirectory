import { defineStore } from 'pinia';

export default defineStore('groupStore', {
	state: () => {
		return {
			groups: []
		}
	},
	actions: {
		loadGroup() {
			return new Promise((resolve, reject) => {
				uni.getStorage({
					key: 'groups',
					success: (res) => {
						this.groups = res.data || [];
						resolve(this.groups);
					},
					fail: () => {
						this.groups = [];
						resolve([]);
					}
				});
			});
		},
		addGroup(group) {
			if (!this.findGroup(group.id)) {
				this.groups.push(group);
				this.saveToStorage();
			}
		},
		removeGroup(groupId) {
			this.groups = this.groups.filter(group => group.id !== groupId);
			this.saveToStorage();
		},
		saveToStorage() {
			uni.setStorage({
				key: 'groups',
				data: this.groups
			});
		},
		clear() {
			this.groups = [];
			uni.removeStorage({
				key: 'groups'
			});
		}
	},
	getters: {
		findGroup: (state) => (id) => {
			return state.groups.find(group => group.id === id);
		}
	}
}); 