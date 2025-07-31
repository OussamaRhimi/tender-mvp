"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import {
  Search,
  Tag,
  Folder,
  Edit,
  Trash2,
  Plus,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

type TagWithStats = {
  id: number;
  name: string;
  parentId: number | null;
  parentName: string | null;
  tenderCount: number;
};

type User = {
  id: number;
  email: string;
  role: string; // Assuming role is a string based on the provided User model
};

export default function TagsDashboard() {
  const [tags, setTags] = useState<TagWithStats[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          credentials: "include", // Ensure cookies are sent with the request
        });
        const data = await res.json();

        if (data.authenticated && data.user?.role === "ADMIN") {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          // Redirect to login if not authenticated or not an admin
          router.push("/");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const fetchTags = async () => {
    if (!isAuthenticated || !isAdmin) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/tags?page=${currentPage}&search=${encodeURIComponent(search)}`,
        {
          credentials: "include", // Ensure cookies are sent with the request
        }
      );
      if (!res.ok) throw new Error(`Failed to fetch tags: ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data.tags)) {
        setTags(data.tags);
        setTotalPages(Math.max(1, data.totalPages || 1));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Fetch tags error:", err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchTags();
    }
  }, [search, currentPage, isAuthenticated, isAdmin]);

  const handleAdd = () => {
    openTagModal("Add New Tag", null, null, fetchTags, tags);
  };

  const handleEdit = (tag: TagWithStats) => {
    openTagModal(
      "Edit Tag",
      tag.id,
      { name: tag.name, parentId: tag.parentId },
      fetchTags,
      tags
    );
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the tag "${name}"? This action cannot be undone.`
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { 
        method: "DELETE",
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (res.ok) {
        fetchTags();
      } else {
        const text = await res.text();
        throw new Error(`Delete failed: ${res.status} - ${text}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete tag";
      alert(message);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading tags...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="text-center max-w-sm">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-700">Error</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchTags}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800">
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 mb-8 text-gray-900">
            <Tag className="h-9 w-9 text-blue-600" aria-hidden="true" />
            Tags Management
          </h1>

          {/* Search & Add */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tags by name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                  aria-label="Search tags"
                />
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium whitespace-nowrap"
              >
                <Plus className="h-5 w-5" /> Add Tag
              </button>
            </div>
          </div>

          {/* Tags List */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {tags.length === 0 ? (
              <div className="p-12 text-center">
                <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No Tags Found</h3>
                <p className="text-gray-500 mt-2">
                  {search
                    ? `No tags match "${search}".`
                    : "There are no tags in the system yet."}
                </p>
                {!search && (
                  <button
                    onClick={handleAdd}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Tag
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Header (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 border-b">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-3">Tag Name</div>
                  <div className="col-span-3">Parent Tag</div>
                  <div className="col-span-3">Tenders</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {/* Tags */}
                <div className="divide-y divide-gray-100">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-4 md:p-6 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="md:grid md:grid-cols-12 md:gap-4 items-center">
                        {/* ID */}
                        <div className="col-span-1 mb-2 md:mb-0">
                          <span className="font-mono text-sm text-gray-500">#{tag.id}</span>
                        </div>

                        {/* Tag Name */}
                        <div className="col-span-3 mb-3 md:mb-0">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold text-gray-900">{tag.name}</span>
                          </div>
                        </div>

                        {/* Parent Tag */}
                        <div className="col-span-3 mb-3 md:mb-0">
                          {tag.parentName ? (
                            <div className="flex items-center gap-2">
                              <Folder className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-800">{tag.parentName}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No parent</span>
                          )}
                        </div>

                        {/* Tenders Count */}
                        <div className="col-span-3 mb-3 md:mb-0 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{tag.tenderCount} tender{tag.tenderCount !== 1 ? "s" : ""}</span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex justify-center gap-4">
                          <button
                            onClick={() => handleEdit(tag)}
                            className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-colors group-hover:scale-105"
                            aria-label={`Edit tag ${tag.name}`}
                          >
                            <Edit className="h-6 w-6" />
                            <span className="text-xs mt-1">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(tag.id, tag.name)}
                            className="flex flex-col items-center text-red-600 hover:text-red-800 transition-colors group-hover:scale-105"
                            aria-label={`Delete tag ${tag.name}`}
                          >
                            <Trash2 className="h-6 w-6" />
                            <span className="text-xs mt-1">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Last
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

// Reusable Modal with Blurred Background
function openTagModal(
  title: string,
  tagId: number | null,
  initialValues: { name?: string; parentId?: number | null } | null = null,
  onSuccess: () => void,
  allTags: { id: number; name: string; parentId: number | null }[]
) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4";

  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">${title}</h3>
      <form id="tagForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
          <input
            type="text"
            id="tagName"
            value="${initialValues?.name || ""}"
            placeholder="Enter tag name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Parent Tag (Optional)</label>
          <select
            id="parentTag"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No Parent</option>
          </select>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            id="cancelBtn"
            class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="saveBtn"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Populate parent options (only top-level tags as parents)
  const select = modal.querySelector<HTMLSelectElement>("#parentTag")!;
  const parentOptions = allTags.filter(
    (t) => t.parentId === null && t.id !== (initialValues?.parentId || tagId)
  );

  parentOptions.forEach((parent) => {
    const option = document.createElement("option");
    option.value = parent.id.toString();
    option.textContent = parent.name;
    if (initialValues?.parentId === parent.id) option.selected = true;
    select.appendChild(option);
  });

  // Cancel button
  modal.querySelector("#cancelBtn")!.addEventListener("click", () => {
    modal.remove();
  });

  // Form submission
  modal.querySelector("#tagForm")!.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (modal.querySelector("#tagName") as HTMLInputElement).value.trim();
    const parentId = (modal.querySelector("#parentTag") as HTMLSelectElement).value || null;

    if (!name) {
      alert("Tag name is required.");
      return;
    }

    const url = tagId ? `/api/admin/tags/${tagId}` : "/api/admin/tags/new";
    const method = tagId ? "PATCH" : "POST";
    const body = JSON.stringify({ name, parentId });

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent with the request
        body,
      });

      if (res.ok) {
        modal.remove();
        onSuccess();
      } else {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} - ${text}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      alert(message);
    }
  });

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}