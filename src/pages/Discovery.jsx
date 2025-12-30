import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Grid3x3, List, X, Zap } from 'lucide-react';
import { Button, CustomSelect, Card } from '../Components/common';
import UserCard from '../Components/common/UserCard';
import RequestSwapModal from '../Components/modals/RequestSwapModal';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import { useUserSearch } from '../hooks/useUsers';
import { useUserSwaps } from '../hooks/useSwaps';
import { useAuthContext } from '../context/AuthContext';

const Discovery = () => {
  // context
  const { user: currentUser } = useAuthContext();

  // State
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Data Fetching with Backend Search
  const { data: searchResults, isLoading: isLoadingUsers } = useUserSearch({
    search: debouncedSearch,
    skill: selectedSkill !== 'All Skills' ? selectedSkill : '',
    location: selectedLocation !== 'All Locations' ? selectedLocation : ''
  });

  const { data: userSwaps, isLoading: isLoadingSwaps } = useUserSwaps(currentUser?.id);

  const isLoading = isLoadingUsers || isLoadingSwaps;

  // Helper to transform user data
  const transformUserData = (rawUsers) => {
    if (!rawUsers) return [];
    return rawUsers
      .filter(u => u.id !== currentUser?.id)
      .map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        role: u.bio ? u.bio.split('.')[0] : 'Skill Swapper',
        skills: u.skillsToTeach?.map(s => s.name || s.title) || [],
        interests: u.skillsToLearn?.map(s => s.name || s.title) || [],
        teaches: u.skillsToTeach?.map(s => s.name || s.title) || [],
        wants: u.skillsToLearn?.map(s => s.name || s.title) || [],
        location: u.location || 'Remote',
        availability: ['Weekends', 'Weekday Evenings'], // Mock
        rating: 5.0, // Mock
        swaps: u.credits ? Math.floor(u.credits / 10) : 0,
        avatar: u.avatar || null,
        initials: (u.firstName?.[0] || '') + (u.lastName?.[0] || ''),
        hasActiveSwap: !!userSwaps?.find(s =>
          (String(s.receiverId) === String(u.id) || String(s.requesterId) === String(u.id)) &&
          ['pending', 'active', 'accepted', 'scheduled', 'in-progress'].includes(s.status)
        ),
        swapStatus: userSwaps?.find(s =>
          (String(s.receiverId) === String(u.id) || String(s.requesterId) === String(u.id)) &&
          ['pending', 'active', 'accepted', 'scheduled', 'in-progress'].includes(s.status)
        )?.status
      }));
  };

  // Transform Data
  const users = useMemo(() => transformUserData(searchResults?.users), [searchResults, currentUser, userSwaps]);
  const unmatches = useMemo(() => transformUserData(searchResults?.unmatches), [searchResults, currentUser, userSwaps]);

  // Extract Filters (from displayed users + unmatches to ensure options exist)
  const { uniqueSkills, uniqueLocations } = useMemo(() => {
    const allVisible = [...users, ...unmatches];
    const skillsSet = new Set();
    const locationsSet = new Set();

    allVisible.forEach(u => {
      u.skills.forEach(s => skillsSet.add(s));
      if (u.location) locationsSet.add(u.location);
    });

    return {
      uniqueSkills: Array.from(skillsSet).sort(),
      uniqueLocations: Array.from(locationsSet).sort(),
    };
  }, [users, unmatches]);

  const handleRequestSwap = (user) => {
    setSelectedUser(user);
    setShowSwapModal(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('');
    setSelectedLocation('');
  };

  const hasActiveFilters = searchQuery || selectedSkill || selectedLocation;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Discover</h1>
              <p className="text-sm text-gray-500 mt-1">
                {users.length > 0
                  ? `Found ${users.length} skill swappers match your vibe`
                  : 'Explore the community'}
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:flex-1 md:max-w-2xl mt-4 md:mt-0">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={22} />
                <input
                  type="text"
                  placeholder="Search for 'React', 'Piano', 'Design'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-gray-900/10 hover:bg-white focus:bg-white rounded-2xl text-base shadow-sm hover:shadow-md focus:shadow-lg transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Filters Toolbar */}
          <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="min-w-[160px]">
                <CustomSelect
                  value={selectedSkill}
                  onChange={setSelectedSkill}
                  options={uniqueSkills.map(s => ({ value: s, label: s }))}
                  placeholder="Any Skill"
                />
              </div>
              <div className="min-w-[160px]">
                <CustomSelect
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  options={uniqueLocations.map(l => ({ value: l, label: l }))}
                  placeholder="Any Location"
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
              <span className="text-xs font-medium text-gray-500 mr-2 uppercase tracking-wide">View:</span>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {users.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4 max-w-3xl mx-auto'
          }>
            {users.map(user => (
              <UserCard
                key={user.id}
                user={user}
                viewMode={viewMode}
                onRequest={handleRequestSwap}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center py-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Search size={24} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">No exact matches found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {unmatches.length > 0
                  ? "Showing all skill swappers instead. Try adjusting your filters!"
                  : "We couldn't find any results. Try checking your spelling or clearing filters."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>

            {/* Show Unmatches (Recommendations from Backend) */}
            {unmatches.length > 0 && (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4 max-w-3xl mx-auto'
              }>
                {unmatches.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    viewMode={viewMode}
                    onRequest={handleRequestSwap}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Swap Modal */}
      {showSwapModal && selectedUser && (
        <RequestSwapModal
          isOpen={showSwapModal}
          onClose={() => setShowSwapModal(false)}
          targetUser={selectedUser}
        />
      )}
    </div>
  );
};

export default Discovery;
