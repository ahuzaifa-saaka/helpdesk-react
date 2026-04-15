import {useGlobal} from "../context/Appcontext";
import SearchBar from "../components/SearchBar";
import StatusDashboard from "../components/StatusDashboard";
import TicketTable from "../components/TicketTable";
import Pagination from "../components/Pagination";
import TicketFormModal from "../components/TicketFormModal";
import TicketDetailModal from "../components/TicketDetailModal";
import AssignModal from "../components/AssignModal";
import CommentModal from "../components/CommentModal";
import DeleteModal from "../components/DeleteModal";
function Dashboard() {
  const {
    theme,
    toggleTheme,
    // sidebar
    sidebarOpen,
    setSidebarOpen,
    // tickets & users data
    ticketItems,
    users,
    filtered,
    paginated,
    safePage,
    totalPages,
    // search & filters
    searchValue,
    setSearchValue,
    filterPriority,
    filterStatus,
    filterAssignee,
    activeFilter,
    currentPage,
    setCurrentPage,
    handleStatusCardClick,
    handleFilterChange,
    setFilterPriority,
    setFilterStatus,
    setFilterAssignee,
    // ticket actions
    handleFormSubmit,
    openEditModal,
    openDeleteModal,
    handleDeleteConfirm,
    openTicketDetail,
    handleTransition,
    openAssignModal,
    handleAssign,
    openCommentModal,
    handleCommentSubmit,
    handleAddUser,
    getUserName,
    // modal states
    formOpen,
    setFormOpen,
    editTicket,
    setEditTicket,
    detailOpen,
    setDetailOpen,
    assignOpen,
    setAssignOpen,
    pendingAssignId,
    commentOpen,
    setCommentOpen,
    deleteOpen,
    setDeleteOpen,
    addUserOpen,
    setAddUserOpen,
    // derived modal data
    activeDetailTicket,
    pendingDeleteTicket,
    pendingAssignTicket,

    // activePage,
    // setActivePage,

    setActiveDetailId,
    activeDetailId,
    setPendingAssignId,
    setPendingCommentId,
    setPendingDeleteId,
  } = useGlobal();
  return (
    <div>
      <>
        <div className="dashboard-text">
          <h3>Dashboard</h3>
        </div>
        <SearchBar
          searchValue={searchValue}
          onSearch={(v) => {
            setSearchValue(v);
            setCurrentPage(1);
          }}
          filterPriority={filterPriority}
          onFilterPriority={handleFilterChange(setFilterPriority)}
          filterStatus={filterStatus}
          onFilterStatus={handleFilterChange(setFilterStatus)}
          filterAssignee={filterAssignee}
          onFilterAssignee={handleFilterChange(setFilterAssignee)}
          onNewTicket={() => {
            setEditTicket(null);
            setFormOpen(true);
          }}
        />

        <StatusDashboard
          tickets={filtered}
          activeFilter={activeFilter}
          onFilterClick={handleStatusCardClick}
        />
        <TicketTable
          tickets={paginated}
          getUserName={getUserName}
          onView={(id) => openTicketDetail(id)}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onAssign={openAssignModal}
        />
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
        />

        {/* Modals */}
        {formOpen && (
          <TicketFormModal
            isOpen={formOpen}
            onClose={() => {
              setFormOpen(false);
              setEditTicket(null);
            }}
            onSubmit={handleFormSubmit}
            editTicket={editTicket}
          />
        )}

        {detailOpen && (
          <TicketDetailModal
            isOpen={detailOpen}
            ticket={activeDetailTicket}
            onClose={() => {
              setDetailOpen(false);
              setActiveDetailId(null);
            }}
            onTransition={handleTransition}
            onOpenComment={openCommentModal}
            onAssign={openAssignModal}
          />
        )}

        {assignOpen && (
          <AssignModal
            isOpen={assignOpen}
            ticketId={pendingAssignId}
            currentAssignee={pendingAssignTicket?.assignedTo}
            onAssign={handleAssign}
            onTransition={handleTransition}
            onClose={() => {
              setAssignOpen(false);
              setPendingAssignId(null);
            }}
          />
        )}

        {commentOpen && (
          <CommentModal
            isOpen={commentOpen}
            onClose={() => {
              setCommentOpen(false);
              setPendingCommentId(null);
            }}
            onSubmit={handleCommentSubmit}
          />
        )}

        {deleteOpen && (
          <DeleteModal
            isOpen={deleteOpen}
            ticket={pendingDeleteTicket}
            onClose={() => {
              setDeleteOpen(false);
              setPendingDeleteId(null);
            }}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </>
    </div>
  );
}

export default Dashboard;
