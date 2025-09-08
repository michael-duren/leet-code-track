import { createSignal } from 'solid-js';
import { Save, Download, Trash2, Info, Github, Palette, Bell } from 'lucide-solid';

const Settings = () => {
  const [activeTab, setActiveTab] = createSignal('appearance');
  const [isLoading, setIsLoading] = createSignal(false);
  
  // Settings state
  const [reviewIntervals, setReviewIntervals] = createSignal({
    firstReview: 3,
    secondReview: 7,
    finalReview: 20
  });
  
  const [notifications, setNotifications] = createSignal({
    dailyReminders: true,
    weeklyReports: true,
    achievementBadges: false
  });

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual data export
      const data = {
        problems: [],
        settings: reviewIntervals(),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leetcode-progress-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Data exported successfully!');
    } catch (error) {
      alert('Failed to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // TODO: Validate and import data
      console.log('Importing data:', data);
      
      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    } finally {
      setIsLoading(false);
      // Reset the input
      input.value = '';
    }
  };

  const handleResetData = async () => {
    const confirmed = confirm(
      'Are you sure you want to reset all data? This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement data reset
      console.log('Resetting all data...');
      alert('All data has been reset successfully.');
    } catch (error) {
      alert('Failed to reset data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Save settings to backend/localStorage
      console.log('Saving settings:', { reviewIntervals: reviewIntervals(), notifications: notifications() });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'review', label: 'Review Settings', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Download },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold mb-2">Settings</h1>
        <p class="text-base-content/70">Customize your LeetCode Progress Tracker experience</p>
      </div>

      {/* Tab Navigation */}
      <div class="tabs tabs-boxed bg-base-200">
        {tabs.map((tab) => (
          <button
            class={`tab gap-2 ${activeTab() === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            <span class="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          {/* Appearance Settings */}
          {activeTab() === 'appearance' && (
            <div class="space-y-6">
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <Palette size={24} />
                Appearance
              </h2>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Theme</span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['light', 'dark', 'cupcake'].map((theme) => (
                    <div class="form-control">
                      <label class="label cursor-pointer bg-base-200 rounded-lg p-4">
                        <div class="flex items-center gap-3">
                          <input
                            type="radio"
                            name="theme-radio"
                            class="radio"
                            value={theme}
                            checked={document.documentElement.getAttribute('data-theme') === theme}
                            onChange={() => {
                              document.documentElement.setAttribute('data-theme', theme);
                              localStorage.setItem('theme', theme);
                            }}
                          />
                          <div>
                            <div class="font-semibold capitalize">{theme}</div>
                            <div class="text-sm text-base-content/70">
                              {theme === 'light' && 'Clean and bright'}
                              {theme === 'dark' && 'Easy on the eyes'}
                              {theme === 'cupcake' && 'Soft and pastel'}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div class="divider"></div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Show problem numbers in card titles</span>
                  <input type="checkbox" class="toggle" checked />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Compact view for problem lists</span>
                  <input type="checkbox" class="toggle" />
                </label>
              </div>
            </div>
          )}

          {/* Review Settings */}
          {activeTab() === 'review' && (
            <div class="space-y-6">
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <Bell size={24} />
                Review Settings
              </h2>
              
              <div class="alert alert-info">
                <Info size={20} />
                <span>Customize the spaced repetition intervals for your reviews.</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">First Review</span>
                    <span class="label-text-alt">Days after initial attempt</span>
                  </label>
                  <input
                    type="number"
                    class="input input-bordered"
                    min="1"
                    max="14"
                    value={reviewIntervals().firstReview}
                    onInput={(e) => setReviewIntervals({
                      ...reviewIntervals(),
                      firstReview: parseInt(e.target.value)
                    })}
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Second Review</span>
                    <span class="label-text-alt">Days after first review</span>
                  </label>
                  <input
                    type="number"
                    class="input input-bordered"
                    min="1"
                    max="30"
                    value={reviewIntervals().secondReview}
                    onInput={(e) => setReviewIntervals({
                      ...reviewIntervals(),
                      secondReview: parseInt(e.target.value)
                    })}
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Final Review</span>
                    <span class="label-text-alt">Days after second review</span>
                  </label>
                  <input
                    type="number"
                    class="input input-bordered"
                    min="7"
                    max="60"
                    value={reviewIntervals().finalReview}
                    onInput={(e) => setReviewIntervals({
                      ...reviewIntervals(),
                      finalReview: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div class="divider"></div>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Notifications</h3>
                
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Daily review reminders</span>
                    <input
                      type="checkbox"
                      class="toggle"
                      checked={notifications().dailyReminders}
                      onChange={(e) => setNotifications({
                        ...notifications(),
                        dailyReminders: e.target.checked
                      })}
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Weekly progress reports</span>
                    <input
                      type="checkbox"
                      class="toggle"
                      checked={notifications().weeklyReports}
                      onChange={(e) => setNotifications({
                        ...notifications(),
                        weeklyReports: e.target.checked
                      })}
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Achievement badges</span>
                    <input
                      type="checkbox"
                      class="toggle"
                      checked={notifications().achievementBadges}
                      onChange={(e) => setNotifications({
                        ...notifications(),
                        achievementBadges: e.target.checked
                      })}
                    />
                  </label>
                </div>
              </div>

              <div class="card-actions justify-end">
                <button
                  class="btn btn-primary"
                  onClick={handleSaveSettings}
                  disabled={isLoading()}
                >
                  {isLoading() ? (
                    <span class="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Save size={16} />
                  )}
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab() === 'data' && (
            <div class="space-y-6">
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <Download size={24} />
                Data Management
              </h2>

              <div class="alert alert-warning">
                <Trash2 size={20} />
                <span>Be careful with data management operations. Always backup your data before making changes.</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card bg-base-200">
                  <div class="card-body">
                    <h3 class="card-title">Export Data</h3>
                    <p class="text-sm">Download all your problems and progress as a JSON file.</p>
                    <div class="card-actions justify-end">
                      <button
                        class="btn btn-primary btn-sm"
                        onClick={handleExportData}
                        disabled={isLoading()}
                      >
                        <Download size={16} />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                <div class="card bg-base-200">
                  <div class="card-body">
                    <h3 class="card-title">Import Data</h3>
                    <p class="text-sm">Restore your problems and progress from a backup file.</p>
                    <div class="card-actions justify-end">
                      <input
                        type="file"
                        accept=".json"
                        class="file-input file-input-bordered file-input-sm w-full max-w-xs"
                        onChange={handleImportData}
                        disabled={isLoading()}
                      />
                    </div>
                  </div>
                </div>

                <div class="card bg-base-200">
                  <div class="card-body">
                    <h3 class="card-title">Storage Usage</h3>
                    <div class="stats stats-vertical">
                      <div class="stat">
                        <div class="stat-title">Total Problems</div>
                        <div class="stat-value text-sm">45</div>
                      </div>
                      <div class="stat">
                        <div class="stat-title">Storage Used</div>
                        <div class="stat-value text-sm">~2.3 KB</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card bg-error text-error-content">
                  <div class="card-body">
                    <h3 class="card-title">⚠️ Reset All Data</h3>
                    <p class="text-sm">Permanently delete all problems and progress. This cannot be undone.</p>
                    <div class="card-actions justify-end">
                      <button
                        class="btn btn-outline btn-error btn-sm"
                        onClick={handleResetData}
                        disabled={isLoading()}
                      >
                        <Trash2 size={16} />
                        Reset All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About */}
          {activeTab() === 'about' && (
            <div class="space-y-6">
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <Info size={24} />
                About
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card bg-gradient-to-br from-primary to-secondary text-primary-content">
                  <div class="card-body">
                    <h3 class="card-title text-2xl">LeetCode Progress Tracker</h3>
                    <p class="mb-4">A spaced repetition system for mastering coding interview problems.</p>
                    <div class="badge badge-outline">Version 1.0.0</div>
                  </div>
                </div>

                <div class="card bg-base-200">
                  <div class="card-body">
                    <h3 class="card-title">Features</h3>
                    <ul class="list-disc list-inside space-y-1 text-sm">
                      <li>Spaced repetition algorithm</li>
                      <li>Progress tracking and analytics</li>
                      <li>Pattern-based organization</li>
                      <li>Dark/light theme support</li>
                      <li>Data export/import</li>
                    </ul>
                  </div>
                </div>

                <div class="card bg-base-200">
                  <div class="card-body">
                    <h3 class="card-title">Tech Stack</h3>
                    <div class="flex flex-wrap gap-2">
                      <div class="badge badge-primary">SolidJS</div>
                      <div class="badge badge-secondary">TypeScript</div>
                      <div class="badge badge-accent">Tailwind CSS</div>
                      <div class="badge badge-neutral">DaisyUI</div>
                      <div class="badge badge-info">Go</div>
                      <div class="badge badge-success">SQLite</div>
                    </div>
                  </div>
                </div>

                <div class="card bg-base-200">
                  <div class="card-body">
                    <h3 class="card-title">Links</h3>
                    <div class="space-y-2">
                      <a href="#" class="btn btn-sm btn-outline w-full">
                        <Github size={16} />
                        View on GitHub
                      </a>
                      <a href="#" class="btn btn-sm btn-outline w-full">
                        📖 Documentation
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-center text-sm text-base-content/70">
                <p>Made with ❤️ for coding interview preparation</p>
                <p>© 2025 LeetCode Progress Tracker</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;