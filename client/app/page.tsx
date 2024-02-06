'use client';

import { ProgramLanguage, type Repository } from 'fetch-github-trending';
import { useState, useEffect } from 'react';
import { trpc } from '../src/api';
import IconFont from '../src/components/iconFont';

interface RepositoryItemProps {
  repo: Repository;
}

function RepositoryItem({ repo }: RepositoryItemProps) {
  const repositoryLink = `https://www.github.com/${repo.owner}/${repo.name}`;

  return (
    <li className="border-b border-b-gray-300 p-5" key={repo.owner + repo.name}>
      <h2 className=" text-xl font-bold">
        <a href={repositoryLink} target="_blank">
          {repo.owner} / {repo.name}
        </a>
      </h2>
      <p className="my-3">{repo.description}</p>
      <div className="flex items-center">
        {repo.programLanguage
          ? [
              <div
                key="color"
                className="bg mr-1 h-[0.9rem] w-[0.9rem] rounded-full"
                style={{
                  backgroundColor: repo.programLanguageColor,
                }}
              ></div>,
              <span className="mr-8 text-sm" key="lang">
                {repo.programLanguage}
              </span>,
            ]
          : undefined}

        <IconFont className="mr-1 text-lg" name="star" />
        <span className="text-sm">{repo.starCount.toLocaleString()}</span>

        <IconFont className="ml-8 mr-1 text-lg" name="fork" />
        <span className="text-sm">{repo.forkCount.toLocaleString()}</span>

        <span className="ml-auto">
          <IconFont className="mr-1 text-lg" name="star" />
          <span className="text-sm">{repo.starCountInDateRange.toLocaleString()} stars today</span>
        </span>
      </div>
    </li>
  );
}

export default function Home() {
  const [repos, setRepos] = useState<Repository[]>([]);

  useEffect(() => {
    const initRepositories = async () => {
      const { repositories } = await trpc.githubTrending.query();
      setRepos(repositories);
    };
    initRepositories();
  }, []);

  return (
    <main className="w-screen py-4">
      <ul className="mx-auto w-3/4 max-w-4xl bg-white">
        {repos.map((repo) => (
          <RepositoryItem key={`${repo.owner}/${repo.name}`} repo={repo} />
        ))}
      </ul>
    </main>
  );
}
