import React, { useState, useMemo } from 'react';
import { Search, MapPin, Grid3x3, List, SlidersHorizontal, X, Zap } from 'lucide-react';
import { Button, CustomSelect, Card } from '../Components/common';
import UserCard from '../Components/common/UserCard';
import RequestSwapModal from '../Components/modals/RequestSwapModal';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import { useUsers } from '../hooks/useUsers';
import { useUserSwaps } from '../hooks/useSwaps';
import { useAuthContext } from '../context/AuthContext';

const Discovery = () => {
  // context
  const { user: currentUser } = useAuthContext();
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();
  const { data: userSwaps, isLoading: isLoadingSwaps } = useUserSwaps(currentUser?.id);

  const isLoading = isLoadingUsers || isLoadingSwaps;

  // State
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Transform Data
  const { users, uniqueSkills, uniqueLocations } = useMemo(() => {
    if (!usersData) return { users: [], uniqueSkills: [], uniqueLocations: [] };

    // 1. Transform raw API users
    const transformedUsers = usersData
      .filter(u => u.id !== currentUser?.id)
      .map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        role: u.bio ? u.bio.split('.')[0] : 'Skill Swapper',
        skills: u.skillsToTeach?.map(s => s.name) || [],
        interests: u.skillsToLearn?.map(s => s.name) || [],
        teaches: u.skillsToTeach?.map(s => s.name) || [],
        wants: u.skillsToLearn?.map(s => s.name) || [],
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

    // 2. Extract unique values
    const skillsSet = new Set();
    const locationsSet = new Set();

    transformedUsers.forEach(u => {
      u.skills.forEach(s => skillsSet.add(s));
      if (u.location) locationsSet.add(u.location);
    });

    return {
      users: transformedUsers,
      uniqueSkills: Array.from(skillsSet).sort(),
      uniqueLocations: Array.from(locationsSet).sort(),
    };
  }, [usersData, currentUser, userSwaps]);

  // Apply filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkill = !selectedSkill || selectedSkill === 'All Skills' ||
        user.skills.some(skill => skill.includes(selectedSkill));

      const matchesLocation = !selectedLocation || selectedLocation === 'All Locations' ||
        user.location.includes(selectedLocation);

      return matchesSearch && matchesSkill && matchesLocation;
    });
  }, [users, searchQuery, selectedSkill, selectedLocation]);

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
              <p className="text-sm text-gray-500 mt-1">Found {filteredUsers.length} skill swappers match your vibe</p>
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
        {filteredUsers.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4 max-w-3xl mx-auto'
          }>
            {filteredUsers.map(user => (
              <UserCard
                key={user.id}
                user={user}
                viewMode={viewMode}
                onRequest={handleRequestSwap}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No matches found</h3>
            <p className="text-gray-500 mb-6">We couldn't find anyone matching your current filters.</p>
            <Button
              variant="outline"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Filters Modal placeholder for completeness if needed, but toolbar handles it reasonably well now */}

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
